import { useState, useEffect } from "react";

import { Link } from "react-router-dom";


export default function Ministries() {

    const [ministries, setMinistries] = useState([]);

    useEffect(() => {
        const getMinistries = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/ministries", { method: "get" });
            let data = await response.json();
            /* console.log("ministries:", data); */
            setMinistries(data);
        }
        getMinistries();
    }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h2 className="font-[Montserrat] font-bold text-[32px] pb-4">Ministries</h2>
            <div className="flex flex-wrap justify-around gap-x-4 gap-y-10">
                {
                    ministries.map((ministry) => (
                        <div className="relative" key={ministry.ministry}>
                            <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${ministry.image}`} className="w-[345px] h-[345px] object-cover rounded-[20px]" alt={`Ministry of ${ministry.ministry}`} />
                            <div className="absolute bottom-0 left-0 px-1 pb-4 text-white font-[Montserrat] font-bold pointer-events-none">
                                <p className="text-[36px]">{ministry.ministry}</p>
                                <p className="text-[20px]">{ministry.slogan}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}