import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BasicInfo() {
    const navigate = useNavigate();
    const [basicInfo, setBasicInfo] = useState({
        name: "",
        beliefs_short: "",
        stay_connected: "",
        form: "",
        facebook: "",
        youtube: "",
        instagram: "",
        address: "",
        about_us: "",
        service_saturdays: "",
        service_sundays: "",
        image: "",
        video: "", // Nuevo campo para el video
    });
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null); // Nuevo estado para el archivo de video
    const [previewVideo, setPreviewVideo] = useState(null); // Vista previa del video
    const [render, setRender] = useState(false);

    useEffect(() => {
        const fetchBasicInfo = async () => {
            try {
                const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/admin/basicinfo', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    setRender(false);
                    navigate('/not-found');
                    throw new Error('Failed to fetch basic info');
                }
                setRender(true);
                const data = await response.json();
                setBasicInfo(data);
            } catch (error) {
                console.error('Error fetching basic info:', error);
                setError('Failed to fetch basic info.');
            }
        };

        fetchBasicInfo();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!basicInfo.name || !basicInfo.beliefs_short || !basicInfo.stay_connected || !basicInfo.form || !basicInfo.facebook || !basicInfo.youtube || !basicInfo.instagram || !basicInfo.address || !basicInfo.about_us || !basicInfo.service_saturdays || !basicInfo.service_sundays) {
            setError("All fields are required.");
            return;
        }
        
        const formData = new FormData();

        for (const key in basicInfo) {
            formData.append(key, basicInfo[key]);
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }
        if (videoFile) { // Añadir archivo de video si existe
            formData.append("video", videoFile);
        }

        try {
            const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/basicinfo/update/submit', {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update basic info');
            }

            setSubmitted('Basic information updated successfully.');
        } catch (error) {
            console.error('Error updating basic info:', error);
            setError('An error occurred while updating basic info.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBasicInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleVideoChange = (e) => { // Manejador para cambios en el archivo de video
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setPreviewVideo(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <>
        {render && (
            <div className="max-w-[1400px] mx-auto px-4 pb-12">
                <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                    Basic Information Update
                </h1>
                <Link
                    to="/admin/dashboard"
                    className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8"
                >
                    <span className="fa-solid fa-chevron-left"></span> Go to Admin Dashboard
                </Link>

                <p className="text-xl pb-8">With this form you can change information of the Church:</p>

                {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
                {submitted && <p className="text-green-600 font-bold pb-4">{submitted}</p>}

                <form onSubmit={handleSubmit} className="text-xl">
                    <input type="hidden" name="_id" value={basicInfo._id} />

                    {/* Existing fields */}
                    <div className="pb-4">
                        <label htmlFor="form_name" className="font-medium">Name of Church:</label>
                        <input
                            type="text"
                            id="form_name"
                            name="name"
                            value={basicInfo.name || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="flex items-start pb-4">
                        <label htmlFor="form_beliefs" className="font-medium">Short Beliefs:</label>
                        <textarea
                            id="form_beliefs"
                            name="beliefs_short"
                            rows="3" 
                            cols="100"
                            value={basicInfo.beliefs_short || ''}
                            onChange={handleChange}
                            className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="flex items-start pb-4">
                        <label htmlFor="form_stay" className="font-medium">Stay connected Section:</label>
                        <textarea
                            id="form_stay"
                            name="stay_connected"
                            rows="3"
                            cols="100"
                            value={basicInfo.stay_connected || ''}
                            onChange={handleChange}
                            className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="flex items-start pb-4">
                        <label htmlFor="form_form" className="font-medium">Form Section:</label>
                        <textarea
                            id="form_form"
                            name="form"
                            rows="3"
                            cols="100"
                            value={basicInfo.form || ''}
                            onChange={handleChange}
                            className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_facebook" className="font-medium">Facebook Link:</label>
                        <input
                            type="text"
                            id="form_facebook"
                            name="facebook"
                            value={basicInfo.facebook || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_youtube" className="font-medium">YouTube Link:</label>
                        <input
                            type="text"
                            id="form_youtube"
                            name="youtube"
                            value={basicInfo.youtube || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_instagram" className="font-medium">Instagram Link:</label>
                        <input
                            type="text"
                            id="form_instagram"
                            name="instagram"
                            value={basicInfo.instagram || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_address" className="font-medium">Address Church:</label>
                        <input
                            type="text"
                            id="form_address"
                            name="address"
                            value={basicInfo.address || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="flex items-start pb-4">
                        <label htmlFor="form_about_us" className="font-medium">About Us Description:</label>
                        <textarea
                            id="form_about_us"
                            name="about_us"
                            rows="6"
                            cols="100"
                            value={basicInfo.about_us || ''}
                            onChange={handleChange}
                            className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    {/* New fields */}
                    <div className="pb-4">
                        <label htmlFor="form_service_saturdays" className="font-medium">Service Saturdays:</label>
                        <input
                            type="text"
                            id="form_service_saturdays"
                            name="service_saturdays"
                            value={basicInfo.service_saturdays || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_service_sundays" className="font-medium">Service Sundays:</label>
                        <input
                            type="text"
                            id="form_service_sundays"
                            name="service_sundays"
                            value={basicInfo.service_sundays || ''}
                            onChange={handleChange}
                            className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        />
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_image" className="font-medium">Church Image:</label>
                        <input
                            type="file"
                            id="form_image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className=""
                        />
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="py-2 w-[300px] h:auto" />
                        ) : (
                            <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${basicInfo.image}`} alt="Event" className="py-2 w-[300px] h:auto" />
                        )}
                    </div>

                    <div className="pb-4">
                        <label htmlFor="form_video" className="font-medium">Church Video:</label>
                        <input
                            type="file"
                            id="form_video"
                            name="video"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className=""
                        />
                        {previewVideo ? (
                            <video src={previewVideo} controls className="py-2 w-[300px] h-auto" />
                        ) : (
                            <video src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${basicInfo.video}`} controls className="py-2 w-[300px] h-auto" />
                        )}
                    </div>

                    <div className="text-center">
                        <button type="submit" className="bg-[#40916c] py-2 px-4 text-white rounded-[5px]">
                            <span className="fa-solid fa-pen"></span> Update
                        </button>
                    </div>
                </form>
            </div>
        )}
        </>
    );
}
