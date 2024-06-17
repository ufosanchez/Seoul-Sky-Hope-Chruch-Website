import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function UpdateMinistry() {
    let { id } = useParams();

    const [ministry, setMinistry] = useState({
        ministry: "",
        slogan: "",
        description: "",
        leader: "",
        image: ""
    });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const getMinistry = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/ministries/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch ministry data");
                }
                let data = await response.json();
                setMinistry(data);
            } catch (error) {
                console.error("Error fetching ministry:", error);
                setError("Failed to fetch ministry data.");
            }
        };
        getMinistry();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ministry.ministry || !ministry.slogan || !ministry.description || !ministry.leader) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("ministry", ministry.ministry);
        formData.append("slogan", ministry.slogan);
        formData.append("description", ministry.description);
        formData.append("leader", ministry.leader);
        if (imageFile) {
            formData.append("image", imageFile);
        } else {
            formData.append("image", ministry.image);
        }

        try {
            const response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/ministries/update/submit`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update ministry");
            }

            setSubmitted("The Ministry was updated successfully");
        } catch (error) {
            console.error("Error updating ministry:", error);
            setError("An error occurred while updating the ministry.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMinistry(prevMinistry => ({ ...prevMinistry, [name]: value }));
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
                Update Ministry: <span className="text-[#AE0303]">{ministry.ministry}</span>
            </h1>
            <Link to="/admin/ministries" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Ministries
            </Link>

            <p className="text-xl pb-8">
                With this form you can change the information of the Ministry: <span className="text-[#AE0303] font-bold">{ministry.ministry}</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <input type="hidden" name="_id" value={id} />

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
                        accept="image/gif, image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className=""
                    />
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="py-2 w-[300px] h:auto" />
                    ) : (
                        <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${ministry.image}`} alt="Ministry" className="py-2 w-[300px] h:auto" />
                    )}
                </div>

                <div className="flex justify-center items-center gap-x-4">
                    <button type="submit" className="bg-[#40916c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-pen"></span> Update
                    </button>
                    <Link to={`/admin/ministries/${id}/delete`} className="inline-block bg-[#eb062c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-trash"></span> Delete
                    </Link>
                </div>
            </form>
        </div>
    );
}
