import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function DeleteStaff() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [people, setPeople] = useState("");
    const [charge, setCharge] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getStaff = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/staff/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch staff data");
                }
                let data = await response.json();
                setPeople(data.people);
                setCharge(data.charge);  
            } catch (error) {
                console.error("Error fetching staff:", error);
                setError("Failed to fetch staff data.");
            }
        };
        getStaff();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/staff/delete/submit", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                throw new Error("Failed to delete staff");
            }

            // Redirigir a la lista de staff después de la eliminación exitosa
            navigate("/admin/staff");
        } catch (error) {
            console.error("Error deleting staff:", error);
            setError("An error occurred while deleting the staff.");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <Link to="/admin/staff" className="inline-block text-[#eb062c] rounded-[10px] p-2 mt-8 border-[1px] border-[#eb062c] duration-500 hover:bg-[#eb062c] hover:text-white">
                <span className="fa-solid fa-chevron-left"></span> Cancel
            </Link>

            <div className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                <h1>Are you sure you want to delete the staff member:</h1>
                <h1 className="text-[#AE0303]">{people} - "{charge}"</h1>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <input type="hidden" name="_id" value={id} />

                <div className="text-center">
                    <button type="submit" className="bg-[#eb062c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-trash"></span> Delete
                    </button>
                </div>
            </form>
        </div>
    );
}
