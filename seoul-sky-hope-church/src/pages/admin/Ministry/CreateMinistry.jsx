import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoImageSelected from '../../../assets/no-image-selected.jpg';

export default function CreateMinistry() {
    const [ministry, setMinistry] = useState({
        ministry: "",
        slogan: "",
        description: "",
        leader: "",
        image: null
    });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [imagePreview, setImagePreview] = useState(NoImageSelected);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all fields are present
        if (!ministry.ministry || !ministry.slogan || !ministry.description || !ministry.leader || !ministry.image) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("ministry", ministry.ministry);
        formData.append("slogan", ministry.slogan);
        formData.append("description", ministry.description);
        formData.append("leader", ministry.leader);
        formData.append("image", ministry.image);

        try {
            const response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/ministries/create/submit`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create ministry");
            }

            // Redirect to the list of ministries after successful creation
            /* navigate("/admin/ministries"); */
            setSubmitted("The Ministry was created satisfactorily");
        } catch (error) {
            console.error("Error creating ministry:", error);
            setError("An error occurred while creating the ministry.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMinistry(prevMinistry => ({ ...prevMinistry, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMinistry(prevMinistry => ({ ...prevMinistry, image: e.target.files[0] }));
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                Create a new Ministry
            </h1>
            <Link to="/admin/ministries" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Ministries
            </Link>

            <p className="text-xl pb-8">
                With this form you can create and add a new <span className="text-[#AE0303] font-bold">Ministry</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <div className="pb-4">
                    <label htmlFor="form_ministry" className="font-medium">Ministry Name: </label>
                    <input
                        type="text"
                        id="form_ministry"
                        name="ministry"
                        value={ministry.ministry}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_slogan" className="font-medium">Slogan: </label>
                    <input
                        type="text"
                        id="form_slogan"
                        name="slogan"
                        value={ministry.slogan}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_description" className="font-medium">Description: </label>
                    <textarea
                        id="form_description"
                        name="description"
                        rows="3"
                        cols="100"
                        value={ministry.description}
                        onChange={handleChange}
                        className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_leader" className="font-medium">Leader: </label>
                    <input
                        type="text"
                        id="form_leader"
                        name="leader"
                        value={ministry.leader}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
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
                    <button type="submit" className="bg-[#52b788] py-4 px-12 hover:bg-[#2d6a4f] hover:text-white duration-500 rounded-[20px]">
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}
