import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

import { Link } from "react-router-dom";

export default function Sermons() {

    const [sermons, setSermons] = useState([]);

    useEffect(() => {
        const getSermons = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/sermons", { method: "get" });
            let data = await response.json();
            console.log("sermons api:", data);
            setSermons(data);
        }
        getSermons();
    }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12 font-[Montserrat]">
            <h1 className="text-5xl text-center font-bold py-8 px-4">Sermons</h1>
            <div className="flex flex-wrap sermon_flex justify-between font-bold gap-x-4 gap-y-8">
                {
                    sermons.map((sermon) => (
                        <Link to={`/sermons/${sermon._id}/details`} className="basis-[400px] p-2 bg-white shadow-[0_0_5px_5px_rgba(0,0,0,0.2)] rounded-lg transition-transform transform duration-500 hover:scale-105" key={sermon.title}>
                            <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${sermon.image}`} className="w-[100%] h-[225px] object-cover" alt={`Image of ${sermon.title}`} />
                            <div className="flex flex-wrap justify-between gap-x-3 text-[#817B7B] mb-2">
                                <p>{sermon.preacher}</p>
                                <p>{format(parseISO(sermon.date), 'MMMM d, yyyy')}</p>
                            </div>
                            <h2 className="text-xl pb-2">{sermon.title}</h2>
                            <p className="font-[Poppins] font-normal">{sermon.verses}</p>
                        </Link>   
                    ))
                }
            </div>
        </div>
    );
}