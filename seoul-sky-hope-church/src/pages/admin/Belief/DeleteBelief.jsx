import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function DeleteBelief() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [belief, setBelief] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getBelief = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/beliefs/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch belief data");
                }
                let data = await response.json();
                setBelief(data.belief);
            } catch (error) {
                console.error("Error fetching belief:", error);
                setError("Failed to fetch belief data.");
            }
        };
        getBelief();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/beliefs/delete/submit", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                throw new Error("Failed to delete belief");
            }

            // Redirigir a la lista de beliefs después de la eliminación exitosa
            navigate("/admin/beliefs");
        } catch (error) {
            console.error("Error deleting belief:", error);
            setError("An error occurred while deleting the belief.");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <Link to="/admin/beliefs" className="inline-block text-[#eb062c] rounded-[10px] p-2 mt-8 border-[1px] border-[#eb062c] duration-500 hover:bg-[#eb062c] hover:text-white">
                <span className="fa-solid fa-chevron-left"></span> Cancel
            </Link>

            <div className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                <h1>Are you sure you want to delete the Belief:</h1>
                <h1 className="text-[#AE0303]">{belief}</h1>
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
