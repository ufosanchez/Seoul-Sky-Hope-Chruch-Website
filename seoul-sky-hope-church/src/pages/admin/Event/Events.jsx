import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Events() {

    const [events, setEvents] = useState([]);
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getEvents = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/admin/events", { method: "get", credentials: 'include', });
            if (!response.ok) {
                setRender(false);
                navigate('/not-found');
                throw new Error('Failed to fetch events');
            }
            setRender(true);
            let data = await response.json();
            console.log("events api:", data);
            setEvents(data);
        }
        getEvents();
    }, [])

    return(
        <>
            {render && (
                <div className="max-w-[1400px] mx-auto px-4 pb-12">
                    <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">List of Events</h1>
                    <div className="flex gap-x-16 flex-wrap pb-8">
                        <Link to="/admin/dashboard" className="font-bold bg-[#023e8a] text-white rounded-[10px] p-2"><span className="fa-solid fa-chevron-left"></span> Go to Admin Dashboard</Link>
                        <Link to="/admin/events/create" className="font-bold bg-[#52b788] hover:bg-[#2d6a4f] hover:text-white rounded-[10px] p-2"><span className="fa-solid fa-plus"></span> Create an Event</Link>
                    </div>
                    <p className="text-xl">On this list, you can find all the Events in the Database:</p>
        
                    <ol className="text-xl py-4 ml-6 font-bold list-decimal">
                        {
                            events.map((event) => (
                                <li className="hover:text-black w-fit underline-admin duration-500 pt-4" key={`${event.name} ${event.start}`}>
                                    <Link to={`/admin/events/${event._id}/update`} className="text-black">
                                        <span className="fa-solid fa-calendar-days text-[#AE0303]"></span> {format(parseISO(event.start), 'MMMM d, yyyy')} -- <span className="text-[#AE0303]">{event.name}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </ol>
                </div>
            )}
        </>
    );
}