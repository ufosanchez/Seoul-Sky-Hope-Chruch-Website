import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

export default function Ministries() {

    const [ministries, setMinistries] = useState([]);
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getMinistries = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/admin/ministries", { method: "get", credentials: 'include', });
            if (!response.ok) {
                setRender(false);
                navigate('/not-found');
                throw new Error('Failed to fetch ministries');
            }
            setRender(true);
            let data = await response.json();
            /* console.log("ministries:", data); */
            setMinistries(data);
        }
        getMinistries();
    }, [])

    return(
        <>
            {render && (
                <div className="max-w-[1400px] mx-auto px-4 pb-12">
                    <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">List of Ministries</h1>
                    <div className="flex gap-x-16 flex-wrap pb-8">
                        <Link to="/admin/dashboard" className="font-bold bg-[#023e8a] text-white rounded-[10px] p-2"><span className="fa-solid fa-chevron-left"></span> Go to Admin Dashboard</Link>
                        <Link to="/admin/ministries/create" className="font-bold bg-[#52b788] hover:bg-[#2d6a4f] hover:text-white rounded-[10px] p-2"><span className="fa-solid fa-plus"></span> Create a Ministry</Link>
                    </div>
                    <p className="text-xl">On this list, you can find all the Ministries in the Database:</p>
        
                    <ol className="text-xl py-4 ml-6 text-[#AE0303] font-bold list-decimal">
                        {
                            ministries.map((ministry) => (
                                <li className="hover:text-black w-fit underline-admin duration-500 pt-4" key={ministry.ministry}>
                                    <Link to={`/admin/ministries/${ministry._id}/update`}>
                                        Ministry of: <span className="text-black">{ministry.ministry}</span>
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