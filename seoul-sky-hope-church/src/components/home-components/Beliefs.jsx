import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

export default function Beliefs() {

    const [basicInfo, setBasicInfo] = useState({});

    useEffect(() => {
        const getBasicInfo = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/basicinfo", { method: "get" });
            let data = await response.json();
            /* console.log("beliefs:", data); */
            setBasicInfo(data);
        }
        getBasicInfo();
    }, [])

    const renderBeliefs = () => {
        return { __html: basicInfo.beliefs_short?.replace(/\n/g, "<br />") };
    }

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h2 className="font-[Montserrat] font-bold text-[32px] pb-4">Our Beliefs</h2>

            {/* <p className="text-2xl pb-8">{basicInfo.beliefs_short}</p> */}
            <p className="text-2xl pb-8" dangerouslySetInnerHTML={renderBeliefs()}></p>

            <div className="text-center">
                <Link to="/about-us" className="text-2xl font-bold bg-[#AE0303] text-white rounded-full py-2 px-6">See more</Link>
            </div>
        </div>
    );
}