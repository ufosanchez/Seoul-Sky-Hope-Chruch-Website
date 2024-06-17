import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

export default function StayConnected() {

    const [basicInfo, setBasicInfo] = useState({});

    useEffect(() => {
        const getBasicInfo = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/basicinfo", { method: "get" });
            let data = await response.json();
            /* console.log("stay connected:", data); */
            setBasicInfo(data);
        }
        getBasicInfo();
    }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h2 className="font-[Montserrat] font-bold text-[32px] pb-4">Stay Connected</h2>
            <p className="text-2xl pb-8">{basicInfo.stay_connected}</p>
            <iframe
            className="rounded-[12px] max-w-[800px] mx-auto mb-8"
            src="https://open.spotify.com/embed/playlist/37i9dQZF1EIUrhzlMYRJTm?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            ></iframe>
            <div className="flex gap-x-[32px] justify-center items-center">
                <Link to={basicInfo.facebook}><span className="fa-brands fa-facebook text-[#0866FF] text-5xl"></span></Link>
                <Link to={basicInfo.youtube}><span className="fa-brands fa-youtube text-[#FF0302] text-5xl"></span></Link>
                <Link to={basicInfo.instagram}><span className="fa-brands fa-instagram text-5xl"></span></Link>
            </div> 
        </div>
    );
}