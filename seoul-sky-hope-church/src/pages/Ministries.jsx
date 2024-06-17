import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

export default function Ministries() {

        const [ministries, setMinistries] = useState([]);

        useEffect(() => {
            const getMinistries = async () => {
                let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/ministries", { method: "get" });
                let data = await response.json();
                console.log("ministries api:", data);
                setMinistries(data);
            }
            getMinistries();
        }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12 font-[Montserrat] font-bold">
            <h1 className="text-5xl text-center py-8 px-4">Our Ministries</h1>
            {
                ministries.map((ministry) => (
                    <div className="mb-10" key={ministry.ministry}>
                        <div className="flex flex-wrap gap-x-12 justify-center">
                            <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${ministry.image}`} className="w-[345px] h-[345px] object-cover rounded-[20px]" alt={`Ministry of ${ministry.ministry}`} />
                            <div className="basis-[500px] flex-1">
                                <h2 className="text-4xl pb-2">{ministry.ministry}</h2>
                                <p className="text-xl text-[#817B7B] pb-8">{ministry.slogan}</p>
                                <p className="text-xl pb-8">{ministry.description}</p>
                                <p className="text-xl"><span className="text-[#AE0303]">Leader:</span> {ministry.leader}</p>
                            </div>
                        </div>
                    </div>    
                ))
            }
        </div>
    );
}