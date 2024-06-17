import { useState, useEffect } from "react";

import Accordion from "../components/about-us-components/Accordion";
import Map from "../components/Map";

export default function AboutUs() {
    const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

    const [basicInfo, setBasicInfo] = useState({});
    const [beliefs, setBeliefs] = useState([]);

    useEffect(() => {
        const getBasicInfo = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/basicinfo", { method: "get" });
            let data = await response.json();
            console.log("about us:", data);
            setBasicInfo(data);
        }
        getBasicInfo();
    }, [])

    useEffect(() => {
        const getBeliefs = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/beliefs", { method: "get" });
            let data = await response.json();
            console.log("beliefs api:", data);
            setBeliefs(data);
        }
        getBeliefs();
    }, [])

    const renderAboutUs = () => {
        return { __html: basicInfo.about_us?.replace(/\n/g, "<br />") };
    }

    const handleAccordionClick = (index) => {
        setOpenAccordionIndex(index === openAccordionIndex ? null : index);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] text-5xl text-center font-bold py-8 px-4">About Us</h1>
            <p className="text-2xl pb-8" dangerouslySetInnerHTML={renderAboutUs()}></p>

            <h1 className="font-[Montserrat] text-5xl text-center font-bold py-8 px-4">Our Beliefs</h1>
            <div>
                {beliefs.map((belief, index) => (
                    <Accordion
                        key={belief.belief}
                        category={belief.belief}
                        description={belief.description}
                        isOpen={openAccordionIndex === index}
                        onClick={() => handleAccordionClick(index)}
                    />
                ))}
            </div>

            <h1 className="font-[Montserrat] text-5xl text-center font-bold py-8 px-4">Find Us</h1>
            <Map />
        </div>
    );
}
