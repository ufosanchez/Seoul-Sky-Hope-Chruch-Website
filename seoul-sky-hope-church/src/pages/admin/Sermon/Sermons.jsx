import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Sermons() {

    const [sermons, setSermons] = useState([]);
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getSermons = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/admin/sermons", { method: "get", credentials: 'include', });
            if (!response.ok) {
                setRender(false);
                navigate('/not-found');
                throw new Error('Failed to fetch sermons');
            }
            setRender(true);
            let data = await response.json();
            console.log("sermons api:", data);
            setSermons(data);
        }
        getSermons();
    }, [])

    return(
        <>
            {render && (
                <div className="max-w-[1400px] mx-auto px-4 pb-12">
                    <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">List of Sermons</h1>
                    <div className="flex gap-x-16 flex-wrap pb-8">
                        <Link to="/admin/dashboard" className="font-bold bg-[#023e8a] text-white rounded-[10px] p-2"><span className="fa-solid fa-chevron-left"></span> Go to Admin Dashboard</Link>
                        <Link to="/admin/sermons/create" className="font-bold bg-[#52b788] hover:bg-[#2d6a4f] hover:text-white rounded-[10px] p-2"><span className="fa-solid fa-plus"></span> Create a Sermon</Link>
                    </div>
                    <p className="text-xl">On this list, you can find all the Sermons in the Database:</p>

                    <ol className="text-xl py-4 ml-6 font-bold list-decimal">
                        {
                            sermons.map((sermon) => (
                                <li className="hover:text-black w-fit underline-admin duration-500 pt-4" key={sermon.title}>
                                    <Link to={`/admin/sermons/${sermon._id}/update`} className="text-black">
                                        <span className="fa-solid fa-calendar-days text-[#AE0303]"></span> {format(parseISO(sermon.date), 'MMMM d, yyyy')} -- <span className="text-[#AE0303]">{sermon.title}</span>  
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