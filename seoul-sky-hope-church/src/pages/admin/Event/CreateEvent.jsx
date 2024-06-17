import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoImageSelected from '../../../assets/no-image-selected.jpg'; // Adjust the path as necessary

export default function CreateEvent() {
    const [event, setEvent] = useState({
        name: "",
        start: "",
        end: "",
        short_description: "",
        description: "",
        organizer: "",
        location: "",
        image: null
    });
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [imagePreview, setImagePreview] = useState(NoImageSelected);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all fields are present
        if (!event.name || !event.start || !event.end || !event.short_description || !event.description || !event.organizer || !event.location || !event.image) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("name", event.name);
        formData.append("start", event.start);
        formData.append("end", event.end);
        formData.append("short_description", event.short_description);
        formData.append("description", event.description);
        formData.append("organizer", event.organizer); 
        formData.append("location", event.location);
        formData.append("image", event.image);

        try {
            const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/events/create/submit', {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create event");
            }

            // Redirect to the list of events after successful creation
            /* navigate("/admin/events"); */
            setError("");
            setEvent({ name: "", start: "", end: "", short_description: "", description: "", organizer: "", location: "", image: null });
            setImagePreview(NoImageSelected);
            setSubmitted("The Event was created satisfactorily");
        } catch (error) {
            console.error("Error creating event:", error);
            setError("An error occurred while creating the event.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEvent(prevEvent => ({ ...prevEvent, image: e.target.files[0] }));
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                Create a New Event
            </h1>
            <Link to="/admin/events" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Events
            </Link>

            <p className="text-xl pb-8">
                With this form you can create and add a new <span className="text-[#AE0303] font-bold">Event</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
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
