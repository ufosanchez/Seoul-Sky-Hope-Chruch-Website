import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateBelief() {
    const [belief, setBelief] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        if (!belief || !description) {
            setError("Both belief and description are required.");
            return;
        }
        
        const newBelief = { belief, description };

        try {
            const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/beliefs/create/submit', { // Ajusta la URL a tu endpoint de la API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBelief),
            });

            if (response.ok) {
                // Si la creación es exitosa, redirige al usuario a la lista de creencias
                console.log('Belief created successfully');
                /* navigate('/admin/beliefs'); // Redireccionar a la lista de creencias */
                setError("")
                setBelief("")
                setDescription("")
                setSubmitted("The new Belief was added satisfactorily");
            } else {
                console.error('Failed to create belief');
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">Create a new Belief</h1>
            <Link to="/admin/beliefs" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to List of Beliefs
            </Link>
            
            <p className="text-xl pb-8">With this form you can create and add a new <span className="text-[#AE0303] font-bold">Belief</span></p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}!!</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <div className="pb-4">
                    <label htmlFor="form_belief" className="font-medium">Belief: </label>
                    <input 
                        type="text" 
                        id="form_belief" 
                        name="belief" 
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        value={belief} // Valor del input controlado por el estado
                        onChange={(e) => setBelief(e.target.value)} // Actualiza el estado cuando el usuario escribe
                    />
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_description" className="font-medium">Description: </label>
                    <textarea 
                        id="form_description" 
                        name="description" 
                        rows="3" 
                        cols="100" 
                        className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"
                        value={description} // Valor del textarea controlado por el estado
                        onChange={(e) => setDescription(e.target.value)} // Actualiza el estado cuando el usuario escribe
                    />
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-[#52b788] py-4 px-12 hover:bg-[#2d6a4f] hover:text-white duration-500 rounded-[20px]">Create</button>
                </div>
            </form>
        </div>
    );
}

/* import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function CreateBelief() {

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">Create a new Belief</h1>
            <Link to="/admin/beliefs" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8"><span className="fa-solid fa-chevron-left"></span> Go to List of Beliefs</Link>
            
            <p className="text-xl pb-8">With this form you can create and add a new <span className="text-[#AE0303] font-bold">Belief</span></p>

            <form action="" method="post" className="text-xl">
                <div className="pb-4">
                    <label htmlFor="form_belief" className="font-medium">Belief: </label>
                    <input type="text" id="form_belief" name="belief" className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"/>
                </div>

                <div className="flex items-start pb-4">
                    <label htmlFor="form_description" className="font-medium">Description: </label>
                    <textarea id="form_description" name="description" rows="3" cols="100" className="ml-4 py-2 px-4 rounded-[10px] border-2 border-[#AE0303]"/>
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-[#52b788] py-4 px-12 hover:bg-[#2d6a4f] hover:text-white duration-500 rounded-[20px]">Create</button>
                </div>
            </form>
        </div>
    );
} */