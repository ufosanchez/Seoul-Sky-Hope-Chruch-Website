import { useState, useEffect } from "react";

import video from "../../assets/Video/video-welcome.mp4"

export default function Welcome() {

    const [basicInfo, setBasicInfo] = useState({});

    useEffect(() => {
        const getBasicInfo = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/basicinfo", { method: "get" });
            let data = await response.json();
            /* console.log("welcome:", data); */
            setBasicInfo(data);
        }
        getBasicInfo();
    }, [])

    return(
        <div className="pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center py-8 px-4">Welcome to {basicInfo.name}</h1>
            <div className="max-w-[1120px] px-4 h-auto mx-auto  overflow-hidden ">
                <video src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${basicInfo.video}`} className="w-full rounded-[20px]" autoPlay loop muted />
            </div>
        </div>
    );
}