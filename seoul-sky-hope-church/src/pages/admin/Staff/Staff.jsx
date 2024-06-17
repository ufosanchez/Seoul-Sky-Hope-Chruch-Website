import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Staff() {

    const [staff, setStaff] = useState([]);
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getStaff = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/admin/staff", { method: "get", credentials: 'include', });
            if (!response.ok) {
                setRender(false);
                navigate('/not-found');
                throw new Error('Failed to fetch staff');
            }
            setRender(true);
            let data = await response.json();
            console.log("staff api:", data);
            setStaff(data);
        }
        getStaff();
    }, [])

    return(
        <>
            {render && (
                <div className="max-w-[1400px] mx-auto px-4 pb-12">
                    <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">List of the Staff</h1>
                    <div className="flex gap-x-16 flex-wrap pb-8">
                        <Link to="/admin/dashboard" className="font-bold bg-[#023e8a] text-white rounded-[10px] p-2"><span className="fa-solid fa-chevron-left"></span> Go to Admin Dashboard</Link>
                        <Link to="/admin/staff/create" className="font-bold bg-[#52b788] hover:bg-[#2d6a4f] hover:text-white rounded-[10px] p-2"><span className="fa-solid fa-plus"></span> Add a new Person</Link>
                    </div>
                    <p className="text-xl">On this list, you can find all the Pastor and Family, Deacons and Leaders in the Database:</p>
        
                    <ol className="text-xl py-4 ml-6  text-[#AE0303] font-bold list-decimal">
                        {
                            staff.map((person) => (
                                <li className="hover:text-black w-fit underline-admin duration-500 pt-4" key={person.people}>
                                    <Link to={`/admin/staff/${person._id}/update`}>
                                        {person.charge}: <span className="text-black">{person.people}</span>
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