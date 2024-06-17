import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function EventDetails() {
    let { id } = useParams();
    const [event, setEvent] = useState({
        name: "",
        start: "",
        end: "",
        short_description: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        const getEvent = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/events/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch event data");
                }
                let data = await response.json();

                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
                setError("Failed to fetch event data.");
            }
        };
        getEvent();
    }, [id]);

    const renderStyleText = () => {
        return { __html: event.description?.replace(/\n/g, "<br />") };
    }

    const formatDateStart = (isoDate) => {
        if (!isoDate) return ''; // handle case where isoDate is empty or null

        // Convertir la fecha de ISO 8601 a un objeto de fecha de JavaScript
        const dateObj = parseISO(isoDate);

        // Formatear la fecha en el formato deseado
        return format(dateObj, 'MMMM d, yyyy h:mm a');
    };

    const formatDateEnd = (isoDate) => {
        if (!isoDate) return ''; // handle case where isoDate is empty or null

        // Convertir la fecha de ISO 8601 a un objeto de fecha de JavaScript
        const dateObj = parseISO(isoDate);

        // Formatear la fecha en el formato deseado
        return format(dateObj, 'h:mm a');
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return ''; // handle case where isoDate is empty or null

        // Convertir la fecha de ISO 8601 a un objeto de fecha de JavaScript
        const dateObj = parseISO(isoDate);

        // Formatear la fecha en el formato deseado
        return format(dateObj, 'EEEE, MMM d');
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <div className="flex flex-wrap py-12 justify-around items-center">
                <div className="basis-[400px]">
                    <h1 className="font-[Montserrat] text-[#AE0303] font-bold text-6xl text-center pb-4">
                        {event.name}
                    </h1>
                    <p className="pb-4 text-lg"><span className="fa-solid fa-calendar-days"></span> {formatDateStart(event.start)} - {formatDateEnd(event.end)}</p>
                    <p className="text-lg text-[#EB741D] font-bold mb-12"><span className="fa-solid fa-location-dot"></span> {event.location}</p>
                </div>
                <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${event.image}`} alt="Image of the event" className="w-[600px] h:auto"/>
            </div>

            <p className="pb-12 text-2xl">{formatDate(event.start)}</p>
            <h2 className="font-[Montserrat] font-bold text-3xl pb-4">{event.name}</h2>

            <p className="pb-4 text-2xl">{event.short_description}</p>

            <p className="pl-8 text-2xl mb-12"><span className="font-bold">By: </span> {event.organizer}</p>

            <h2 className="font-[Montserrat] font-bold text-3xl pb-4">Date and time</h2>
            <p className="text-2xl mb-12"><span className="fa-solid fa-calendar-days"></span> {formatDateStart(event.start)} - {formatDateEnd(event.end)}</p>

            <h2 className="font-[Montserrat] font-bold text-3xl pb-4">Location</h2>
            <p className="text-2xl mb-12"><span className="fa-solid fa-location-dot"></span> {event.location}</p>

            <h2 className="font-[Montserrat] font-bold text-3xl pb-4">About this event</h2>
            <p className="text-2xl pb-8" dangerouslySetInnerHTML={renderStyleText()}></p>
        </div>
    );
}
