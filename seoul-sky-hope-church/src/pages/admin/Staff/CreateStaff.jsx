import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoImageSelected from '../../../assets/no-image-selected.jpg'; // Adjust the path as necessary

export default function CreateStaff() {
    const [staff, setStaff] = useState({ people: "", charge: "", image: null });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [imagePreview, setImagePreview] = useState(NoImageSelected);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStaff(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setStaff(prevState => ({ ...prevState, image: event.target.files[0] }));
            setImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form behavior

        const { people, charge, image } = staff;

        if (!people || !charge || !image) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("people", people);
        formData.append("charge", charge);
        formData.append("image", image);

        try {
            const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/staff/create/submit', { // Adjust the URL to your API endpoint
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Staff created successfully');
                // navigate('/admin/staff'); // Redirect to the list of staff
                setError("");
                setStaff({ people: "", charge: "", image: null });
                setImagePreview(NoImageSelected);
                setSubmitted("The new staff member was added satisfactorily");
            } else {
                console.error('Failed to create staff');
                setError("Failed to create staff.");
            }
        } catch (error) {
            console.error('An error occurred', error);
            setError("An error occurred while creating the staff.");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">Create a new Charge (Staff)</h1>
            <Link to="/admin/staff" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Staff
            </Link>
            
            <p className="text-xl pb-8">With this form you can create and add a new <span className="text-[#AE0303] font-bold">Charge</span> and assign a person</p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <div className="pb-4">
                    <label htmlFor="form_people" className="font-medium">Name: </label>
                    <input 
                        type="text" 
                        id="form_people" 
                        name="people" 
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        value={staff.people} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_charge" className="font-medium">Charge: </label>
                    <input 
                        type="text" 
                        id="form_charge" 
                        name="charge" 
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        value={staff.charge} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_image" className="font-medium">Image: </label>
                    <input
                        type="file"
                        id="form_image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className=""
                    />
                    <img src={imagePreview} alt="Preview" className="py-2 w-[300px] h:auto" />
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-[#52b788] py-4 px-12 hover:bg-[#2d6a4f] hover:text-white duration-500 rounded-[20px]">Create</button>
                </div>
            </form>
        </div>
    );
}
