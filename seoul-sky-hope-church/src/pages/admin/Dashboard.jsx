import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [error, setError] = useState(null); // Añade estado para manejar errores
    const navigate = useNavigate();
    const [render, setRender] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/admin/dashboard', {
                    credentials: 'include',
                });

                if (response.ok) {
                    console.log("Login successful");
                    setRender(true);
                } else {
                    console.log("Login failed");
                    setRender(false)
                    navigate('/not-found');
                }
            } catch (error) {
                console.error('Error fetching basic info:', error);
                setError('Failed to fetch basic info.');
                navigate('/not-found');
            }
        };

        fetchToken();
    }, [navigate]);

    return(
        <>
            {render && (
                <div className="max-w-[1400px] mx-auto px-4 pb-12">
                    <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12 px-4">Admin Dashboard</h1>
                    <p className="text-xl">In this Dashboard you can go to the main parts where you can change the information of the Website</p>

                    <ul className="text-xl py-4 text-[#AE0303] font-bold list-disc">
                        <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/basic-info/update">Basic Content of the Church</Link></li>
                        <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/ministries">List of Ministries</Link></li>
                        <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/sermons">List of Sermons</Link></li>
                        <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/events">List of Events</Link></li>
                        <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/staff">List of Staff</Link></li>
                        <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/beliefs">List of Beliefs</Link></li>
                        {/* <li className="mx-4 hover:text-black w-fit underline-admin duration-500 pt-4"><Link to="/admin/members">List of Members of the Church</Link></li> */}
                    </ul>
                </div>
            )}
        </>
    );
}