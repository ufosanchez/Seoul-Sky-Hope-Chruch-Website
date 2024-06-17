import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function UpdateBelief() {
    let { id } = useParams();
    const [belief, setBelief] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getBelief = async () => {
            try {
                let response = await fetch(`https://seoul-sky-hope-church-api.vercel.app/api/beliefs/${id}`, { method: "GET" });
                if (!response.ok) {
                    throw new Error("Failed to fetch belief data");
                }
                let data = await response.json();
                setBelief(data.belief);
                setDescription(data.description);
            } catch (error) {
                console.error("Error fetching belief:", error);
                setError("Failed to fetch belief data.");
            }
        };
        getBelief();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que los campos no estén vacíos
        if (!belief || !description) {
            setError("Both belief and description are required.");
            return;
        }

        try {
            const response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/beliefs/update/submit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, belief, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to update belief");
            }

            // Redirigir a la lista de beliefs después de la actualización exitosa
            /* navigate("/admin/beliefs"); */
            setSubmitted("The Belief was updated satisfactorily");
        } catch (error) {
            console.error("Error updating belief:", error);
            setError("An error occurred while updating the belief.");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">
                Update Belief: <span className="text-[#AE0303]">{belief}</span>
            </h1>
            <Link to="/admin/beliefs" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Beliefs
            </Link>

            <p className="text-xl pb-8">
                With this form you can change the information of the Belief: <span className="text-[#AE0303] font-bold">{belief}</span>
            </p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <input type="hidden" name="_id" value={id} />

                <div className="pb-4">
                    <label htmlFor="form_belief" className="font-medium">Belief: </label>
                    <input
                        type="text"
                        id="form_belief"
                        name="belief"
                        value={belief}
                        onChange={(e) => setBelief(e.target.value)}
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_description" className="font-medium">Description: </label>
                    <textarea
                        id="form_description"
                        name="description"
                        rows="3"
                        cols="100"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                    />
                </div>

                <div className="flex justify-center items-center gap-x-4">
                    <button type="submit" className="bg-[#40916c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-pen"></span> Update
                    </button>
                    <Link to={`/admin/beliefs/${id}/delete`} className="inline-block bg-[#eb062c] py-2 px-4 text-white rounded-[5px]">
                        <span className="fa-solid fa-trash"></span> Delete
                    </Link>
                </div>
            </form>
        </div>
    );
}
