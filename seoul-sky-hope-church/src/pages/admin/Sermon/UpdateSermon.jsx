import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function UpdateSermon() {
    let { id } = useParams();

    const [sermon, setSermon] = useState({
        title: "",
        link_youtube: "",
        preacher: "",
        date: "",
        description: "",
        verses: "",
        image: ""
    });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const getSermon = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/sermons/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch sermon data");
                }
                let data = await response.json();

                // Format date for datetime-local without converting to UTC
                data.date = formatDateForInput(new Date(data.date));

                setSermon(data);
            } catch (error) {
                console.error("Error fetching sermon:", error);
                setError("Failed to fetch sermon data.");
            }
        };
        getSermon();
    }, [id]);

    const formatDateForInput = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().slice(0, 16);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all fields are present
        if (!sermon.title || !sermon.link_youtube || !sermon.preacher || !sermon.date || !sermon.description || !sermon.verses) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("title", sermon.title);
        formData.append("link_youtube", sermon.link_youtube);
        formData.append("preacher", sermon.preacher);
        formData.append("date", sermon.date);
        formData.append("description", sermon.description);
        formData.append("verses", sermon.verses);
        if (imageFile) {
            formData.append("image", imageFile);
        } else {
            formData.append("image", sermon.image);
        }

        try {
            const response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/sermons/update/submit`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update sermon");
            }

            setSubmitted("The Sermon was updated successfully");
        } catch (error) {
            console.error("Error updating sermon:", error);
            setError("An error occurred while updating the sermon.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSermon(prevSermon => ({ ...prevSermon, [name]: value }));
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
                Update Sermon: <span className="text-[#AE0303]">{sermon.title}</span>
            </h1>
            <Link to="/admin/sermons" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Sermons
            </Link>

            <p className="text-xl pb-8">
                With this form you can change the information of the Sermon: <span className="text-[#AE0303] font-bold">{sermon.title}</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <input type="hidden" name="_id" value={id} />

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
                        accept="image/gif, image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className=""
                    />
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="py-2 w-[300px] h:auto" />
                    ) : (
                        <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${sermon.image}`} alt="Sermon" className="py-2 w-[300px] h:auto" />
                    )}
                </div>

                <div className="flex justify-center items-center gap-x-4">
                    <button type="submit" className="bg-[#40916c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-pen"></span> Update
                    </button>
                    <Link to={`/admin/sermons/${id}/delete`} className="inline-block bg-[#eb062c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-trash"></span> Delete
                    </Link>
                </div>
            </form>
        </div>
    );
}
