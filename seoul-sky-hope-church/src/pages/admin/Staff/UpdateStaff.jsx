import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function UpdateStaff() {
    let { id } = useParams();
    const [staff, setStaff] = useState({ people: "", charge: "", image: "" });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getStaff = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/staff/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch staff data");
                }
                let data = await response.json();
                setStaff(data);
            } catch (error) {
                console.error("Error fetching staff:", error);
                setError("Failed to fetch staff data.");
            }
        };
        getStaff();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate that all fields are present
        if (!staff.people || !staff.charge) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("people", staff.people);
        formData.append("charge", staff.charge);
        if (imageFile) {
            formData.append("image", imageFile);
        } else {
            formData.append("image", staff.image);
        }

        try {
            const response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/staff/update/submit`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update staff");
            }

            setSubmitted("The Staff was updated successfully");
        } catch (error) {
            console.error("Error updating staff:", error);
            setError("An error occurred while updating the staff.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaff(prevStaff => ({ ...prevStaff, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                Update Staff: <span className="text-[#AE0303]">{staff.charge}</span>
            </h1>
            <Link to="/admin/staff" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Staff
            </Link>

            <p className="text-xl pb-8">
                With this form you can change the information of the Charge <span className="text-[#AE0303] font-bold">{staff.charge}</span>: "{staff.people}"
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <input type="hidden" name="_id" value={id} />

                <div className="pb-4">
                    <label htmlFor="form_people" className="font-medium">Name: </label>
                    <input
                        type="text"
                        id="form_people"
                        name="people"
                        value={staff.people}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_charge" className="font-medium">Charge: </label>
                    <input
                        type="text"
                        id="form_charge"
                        name="charge"
                        value={staff.charge}
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
                        accept="image/gif, image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className=""
                    />
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="py-2 w-[300px] h:auto" />
                    ) : (
                        <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${staff.image}`} alt="Staff" className="py-2 w-[300px] h:auto" />
                    )}
                </div>

                <div className="flex justify-center items-center gap-x-4">
                    <button type="submit" className="bg-[#40916c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-pen"></span> Update
                    </button>
                    <Link to={`/admin/staff/${id}/delete`} className="inline-block bg-[#eb062c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-trash"></span> Delete
                    </Link>
                </div>
            </form>
        </div>
    );
}
