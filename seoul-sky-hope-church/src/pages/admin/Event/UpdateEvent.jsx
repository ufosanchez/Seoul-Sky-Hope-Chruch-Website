import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function UpdateEvent() {
    let { id } = useParams();
    const [event, setEvent] = useState({
        name: "",
        start: "",
        end: "",
        short_description: "",
        description: "",
        organizer: "",
        location: "",
        image: ""
    });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getEvent = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/events/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch event data");
                }
                let data = await response.json();

                data.start = formatDateForInput(new Date(data.start));
                data.end = formatDateForInput(new Date(data.end));

                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
                setError("Failed to fetch event data.");
            }
        };
        getEvent();
    }, [id]);

    const formatDateForInput = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().slice(0, 16);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!event.name || !event.start || !event.end || !event.short_description || !event.description || !event.organizer || !event.location) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", event.name);
        formData.append("start", event.start);
        formData.append("end", event.end);
        formData.append("short_description", event.short_description);
        formData.append("description", event.description);
        formData.append("organizer", event.organizer);
        formData.append("location", event.location);
        if (imageFile) {
            formData.append("image", imageFile);
        } else {
            formData.append("image", event.image);
        }

        try {
            const response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/events/update/submit`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update event");
            }

            setSubmitted("The Event was updated satisfactorily");
        } catch (error) {
            console.error("Error updating event:", error);
            setError("An error occurred while updating the event.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
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
                Update Event: <span className="text-[#AE0303]">{event.name}</span>
            </h1>
            <Link to="/admin/events" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Events
            </Link>

            <p className="text-xl pb-8">
                With this form you can change the information of the Event: <span className="text-[#AE0303] font-bold">{event.name}</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <input type="hidden" name="_id" value={id} />

                <div className="pb-4">
                    <label htmlFor="form_name" className="font-medium">Event Name: </label>
                    <input
                        type="text"
                        id="form_name"
                        name="name"
                        value={event.name}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_start" className="font-medium">Start Event: </label>
                    <input
                        type="datetime-local"
                        id="form_start"
                        name="start"
                        value={event.start}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_end" className="font-medium">End Event: </label>
                    <input
                        type="datetime-local"
                        id="form_end"
                        name="end"
                        value={event.end}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_short_description" className="font-medium">Short description: </label>
                    <textarea
                        id="form_short_description"
                        name="short_description"
                        rows="3"
                        cols="100"
                        value={event.short_description}
                        onChange={handleChange}
                        className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_description" className="font-medium">Description: </label>
                    <textarea
                        id="form_description"
                        name="description"
                        rows="3"
                        cols="100"
                        value={event.description}
                        onChange={handleChange}
                        className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_organizer" className="font-medium">Organizer: </label>
                    <input
                        type="text"
                        id="form_organizer"
                        name="organizer"
                        value={event.organizer}
                        onChange={handleChange}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_location" className="font-medium">Location: </label>
                    <input
                        type="text"
                        id="form_location"
                        name="location"
                        value={event.location}
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
                        <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${event.image}`} alt="Event" className="py-2 w-[300px] h:auto" />
                    )}
                </div>

                <div className="flex justify-center items-center gap-x-4">
                    <button type="submit" className="bg-[#40916c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-pen"></span> Update
                    </button>
                    <Link to={`/admin/events/${id}/delete`} className="inline-block bg-[#eb062c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-trash"></span> Delete
                    </Link>
                </div>
            </form>
        </div>
    );
}
