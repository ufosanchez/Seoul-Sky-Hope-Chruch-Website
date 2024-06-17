import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/NavBar/logo2.png"

export default function Footer(){

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    return(
        <footer id="footer">
            <div className="flex items-center justify-around px-4 pb-12">
                <div className="text-2xl text-center">
                    <img className="pb-4 mx-auto max-w-[68px] h:auto" src={basicInfo.image ? `https://seoul-sky-hope-church-api.vercel.app/uploads/${basicInfo.image}` : logo} alt="Seoul Sky Hope Church Logo" />
                    <p className="pb-4">{basicInfo.address}</p>
                    <p className="font-[Montserrat] font-bold text-[28px] pb-4">Service Sundays</p>
                    <p className="pb-4">{basicInfo.service_sundays}</p>
                    <p className="font-[Montserrat] font-bold text-[28px] pb-4">Service Saturdays</p>
                    <p>{basicInfo.service_saturdays}</p>
                </div>
                <div className="hidden font-[Montserrat] font-bold text-[16px] gap-x-16 text-[#808080]  md:flex">
                    <ul>
                        <li className="pb-4"><Link to="/ministries" onClick={scrollToTop}>Ministries</Link></li>
                        <li className="pb-4"><Link to="/sermons" onClick={scrollToTop}>Sermons</Link></li>
                        <li><Link to="/bible" onClick={scrollToTop}>Bible</Link></li>
                    </ul>
                    <ul>
                        <li className="pb-4"><Link to="/events" onClick={scrollToTop}>Events</Link></li>
                        <li className="pb-4"><Link to="/staff" onClick={scrollToTop}>Staff</Link></li>
                        {/* <li className="pb-4"><Link to="/media" onClick={scrollToTop}>Media</Link></li> */}
                        <li><Link to="/about-us" onClick={scrollToTop}>About us</Link></li>
                    </ul>
                </div>
            </div>
            <div className="bg-[#AE0303]">
                <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center text-white font-[Montserrat] font-bold h-[80px]">
                    <p>&copy; Copyright Arnulfo Sanchez, 2024</p>
                    <Link to="/admin/login">Staff Login</Link>
                    <div className="hidden gap-x-[32px] justify-center items-center md:flex">
                        <Link to={basicInfo.facebook}><span className="fa-brands fa-facebook text-4xl"></span></Link>
                        <Link to={basicInfo.youtube}><span className="fa-brands fa-youtube text-4xl"></span></Link>
                        <Link to={basicInfo.instagram}><span className="fa-brands fa-instagram text-4xl"></span></Link>
                    </div> 
                </div>
            </div>
        </footer>
    );
}