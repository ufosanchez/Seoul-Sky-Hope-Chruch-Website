import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Events(){

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getEvents = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/events", { method: "get" });
            let data = await response.json();
            /* console.log("events:", data); */
            setEvents(data);
        }
        getEvents();
    }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h2 className="font-[Montserrat] font-bold text-[32px] pb-4">Events</h2>
            {
                events.map((event, index) => {
                    if(index <= 1){
                        return(
                            <Link to={`/events/${event._id}/details`} className="flex flex-wrap items-center gap-x-8 py-6 px-4 my-6 bg-[#a1afbe] shadow-md rounded-lg transition-transform transform duration-500 hover:scale-105" key={event.name}>
                                <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${event.image}`} className="w-[400px] mx-auto h-auto" alt={event.name} />
                                <div className="basis-[515px] flex-1">
                                    <p className="font-bold pb-4 text-[28px]">{event.name}</p>
                                    <p className="pb-4 text-2xl"><span className="fa-solid fa-calendar-days"></span> {format(parseISO(event.start), 'MMMM d, yyyy h:mm a')} - {format(parseISO(event.end), 'h:mm a')}</p>
                                    <p className="text-2xl">{event.short_description}</p>
                                </div>
                            </Link>
                        )
                    }
                })
            }
            <div className="text-center">
                <Link to="/events" className="text-2xl font-bold bg-[#AE0303] text-white rounded-full py-2 px-6">See more events</Link>
            </div>
        </div>
    );
}