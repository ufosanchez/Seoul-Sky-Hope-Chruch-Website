import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

export default function Beliefs() {

    const [beliefs, setBeliefs] = useState([]);
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getBeliefs = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/admin/beliefs", { method: "get", credentials: 'include', });
            if (!response.ok) {
                setRender(false);
                navigate('/not-found');
                throw new Error('Failed to fetch beliefs');
            }
            setRender(true);
            let data = await response.json();
            console.log("beliefs api:", data);
            setBeliefs(data);
        }
        getBeliefs();
    }, [])

    return(
        <>
            {render && (
                <div className="max-w-[1400px] mx-auto px-4 pb-12">
                    <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">List of our Beliefs</h1>
                    <div className="flex gap-x-16 flex-wrap pb-8">
                        <Link to="/admin/dashboard" className="font-bold bg-[#023e8a] text-white rounded-[10px] p-2"><span className="fa-solid fa-chevron-left"></span> Go to Admin Dashboard</Link>
                        <Link to="/admin/beliefs/create" className="font-bold bg-[#52b788] hover:bg-[#2d6a4f] hover:text-white rounded-[10px] p-2"><span className="fa-solid fa-plus"></span> Add a new Belief</Link>
                    </div>
                    <p className="text-xl">On this list, you can find all our Beliefs:</p>
        
                    <ol className="text-xl py-4 ml-6 text-[#AE0303] font-bold list-decimal">
                        {
                            beliefs.map((belief) => (
                                <li className="hover:text-black w-fit underline-admin duration-500 pt-4" key={belief.belief}>
                                    <Link to={`/admin/beliefs/${belief._id}/update`}>
                                        Category: <span className="text-black">{belief.belief}</span>
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