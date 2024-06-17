import logo from "../assets/NavBar/logo2.png"
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from "react";

export default function NavBar() {

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

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
        <div className="shadow">
            <nav id="navbar" className="max-w-[1400px] mx-auto p-4 md:flex md:items-center md:justify-between">
                <div className="flex justify-between items-center">
                    <span>
                        <NavLink to="/" className="flex items-center font-[Pacifico] font-medium text-xl"><img className="h-12" src={basicInfo.image ? `https://seoul-sky-hope-church-api.vercel.app/uploads/${basicInfo.image}` : logo} alt="Seoul Sky Hope Church Logo" />Seoul Sky Hope</NavLink>
                    </span>

                    <span className="text-3xl cursor-pointer mx-2 md:hidden block">
                        <span className={`fa-solid ${!showMenu ? 'fa-bars' : 'fa-xmark'}`} onClick={toggleMenu}></span>
                    </span>
                </div>

                {showMenu && (
                    <ul className="md:hidden flex flex-col justify-center items-center font-medium">
                        <li className="hover:text-[#AE0303] underline-progressive duration-500 pt-4"><NavLink to="/ministries">Ministries</NavLink></li>
                        <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/sermons">Sermons</NavLink></li>
                        <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/bible">Bible</NavLink></li>
                        <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/events">Events</NavLink></li>
                        <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/staff">Staff</NavLink></li>
                        {/* <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/media">Media</NavLink></li> */}
                        <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/about-us">About Us</NavLink></li>
                    </ul>
                    )
                }
                
                <ul className="md:flex md:items-center gap-x-6 hidden font-medium">
                    <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/ministries">Ministries</NavLink></li>
                    <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/sermons">Sermons</NavLink></li>
                    <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/bible">Bible</NavLink></li>
                    <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/events">Events</NavLink></li>
                    <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/staff">Staff</NavLink></li>
                    {/* <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/media">Media</NavLink></li> */}
                    <li className="hover:text-[#AE0303] underline-progressive duration-500"><NavLink to="/about-us">About Us</NavLink></li>
                </ul>
            </nav>
        </div>
    );
}