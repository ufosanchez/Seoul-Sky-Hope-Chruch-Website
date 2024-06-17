import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import YouTube from 'react-youtube';

export default function SermonDetails() {
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

    useEffect(() => {
        const getSermon = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/sermons/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch sermon data");
                }
                let data = await response.json();

                setSermon(data);
            } catch (error) {
                console.error("Error fetching sermon:", error);
                setError("Failed to fetch sermon data.");
            }
        };
        getSermon();
    }, [id]);

    const renderStyleText = () => {
        return { __html: sermon.description?.replace(/\n/g, "<br />") };
    }

    const formatDate = (isoDate) => {
        if (!isoDate) return ''; // handle case where isoDate is empty or null

        // Convertir la fecha de ISO 8601 a un objeto de fecha de JavaScript
        const dateObj = parseISO(isoDate);

        // Formatear la fecha en el formato deseado
        return format(dateObj, 'MMMM d, yyyy');
    };

    // Extrae el ID del video de YouTube desde el enlace
    const getYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(sermon.link_youtube);

    const opts = {
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] text-[#AE0303] font-bold text-6xl text-center py-12">
                {sermon.title}
            </h1>
    
            <div className="max-w-[700px] mx-auto mb-2">
                {videoId && (
                    <div className="youtube-video-container">
                        <YouTube videoId={videoId} opts={opts} />
                    </div>
                )}
            </div>
    
            <div className="flex justify-center gap-x-16 text-xl text-[#817B7B] py-6">
                <div className="flex items-center gap-2">
                    <span className="fa-solid fa-user-tie text-black"></span>
                    <p className="font-bold">{sermon.preacher}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="fa-solid fa-calendar-days text-black"></span>
                    <p className="font-bold">{formatDate(sermon.date)}</p>
                </div>
            </div>
    
            <div className="max-w-[900px] mx-auto text-2xl text-gray-800 pb-12" dangerouslySetInnerHTML={renderStyleText()}></div>
    
            <div className="max-w-[900px] mx-auto">
                <h2 className="font-[Montserrat] text-2xl font-bold text-[#AE0303] pb-4 flex items-center">
                    <span className="fa-solid fa-book-bible mr-2"></span> Verses
                </h2>
                <p className="text-2xl font-medium">{sermon.verses}</p>
            </div>
        </div>
    );
    
}
