import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Events(){

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getEvents = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/events", { method: "get" });
            let data = await response.json();
            console.log("events api:", data);
            setEvents(data);
        }
        getEvents();
    }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
             <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12 px-4">What’s happening now at Seoul Sky Hope Church</h1>
            {
                events.map((event) => (
                    <Link to={`/events/${event._id}/details`} className="flex flex-wrap items-center gap-x-8 py-6 px-4 my-6 bg-[#a1afbe] shadow-md rounded-lg transition-transform transform duration-500 hover:scale-105" key={`${event.name} ${event.start}`}>
                        <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${event.image}`} className="w-[400px] mx-auto h-auto" alt={event.name} />
                        <div className="basis-[515px] flex-1">
                            <p className="font-bold pb-4 text-[28px]">{event.name}</p>
                            <p className="pb-4 text-2xl"><span className="fa-solid fa-calendar-days text-[#AE0303]"></span> {format(parseISO(event.start), 'MMMM d, yyyy h:mm a')} - {format(parseISO(event.end), 'h:mm a')}</p>
                            <p className="text-2xl">{event.short_description}</p>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}