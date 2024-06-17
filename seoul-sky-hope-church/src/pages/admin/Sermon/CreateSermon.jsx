import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoImageSelected from '../../../assets/no-image-selected.jpg';

export default function CreateSermon() {
    const [sermon, setSermon] = useState({
        title: "",
        link_youtube: "",
        preacher: "",
        date: "",
        description: "",
        verses: "",
        image: null
    });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [imagePreview, setImagePreview] = useState(NoImageSelected);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all fields are present
        if (!sermon.title || !sermon.link_youtube || !sermon.preacher || !sermon.date || !sermon.description || !sermon.verses || !sermon.image) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", sermon.title);
        formData.append("link_youtube", sermon.link_youtube);
        formData.append("preacher", sermon.preacher);
        formData.append("date", sermon.date);
        formData.append("description", sermon.description);
        formData.append("verses", sermon.verses);
        formData.append("image", sermon.image);

        try {
            const response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/sermons/create/submit`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create sermon");
            }

            // Redirect to the list of sermons after successful creation
            /* navigate("/admin/sermons"); */
            setError("");
            setSermon({ title: "", link_youtube: "", preacher: "", date: "", description: "", verses: "", image: null });
            setImagePreview(NoImageSelected);
            setSubmitted("The Sermon was created satisfactorily");
        } catch (error) {
            console.error("Error creating sermon:", error);
            setError("An error occurred while creating the sermon.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSermon(prevSermon => ({ ...prevSermon, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSermon(prevSermon => ({ ...prevSermon, image: e.target.files[0] }));
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                Create a new Sermon
            </h1>
            <Link to="/admin/sermons" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Sermons
            </Link>

            <p className="text-xl pb-8">
                With this form you can create and add a new <span className="text-[#AE0303] font-bold">Sermon</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <div className="pb-4">
                    <label htmlFor="form_title" className="font-medium">Title Sermon: </label>
                    <input
                        type="text"
                        id="form_title"
                        name="title"
                        value={sermon.title}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_link_youtube" className="font-medium">Link YouTube: </label>
                    <input
                        type="text"
                        id="form_link_youtube"
                        name="link_youtube"
                        value={sermon.link_youtube}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_preacher" className="font-medium">Preacher: </label>
                    <input
                        type="text"
                        id="form_preacher"
                        name="preacher"
                        value={sermon.preacher}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_date" className="font-medium">Date: </label>
                    <input
                        type="datetime-local"
                        id="form_date"
                        name="date"
                        value={sermon.date}
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
                        value={sermon.description}
                        onChange={handleChange}
                        className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_verses" className="font-medium">Verses: </label>
                    <input
                        type="text"
                        id="form_verses"
                        name="verses"
                        value={sermon.verses}
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
