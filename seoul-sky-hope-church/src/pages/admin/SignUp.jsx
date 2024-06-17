import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !email || !password) {
            setError("Name, email, and password are required.");
            return;
        }

        const newUser = { name, email, password };

        try {
            const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                console.log('User created successfully');
                setError("");
                setName("");
                setEmail("");
                setPassword("");
                setSubmitted("User created successfully!");
            } else {
                console.error('Failed to create user');
                setError("Failed to create user");
            }
        } catch (error) {
            console.error('An error occurred', error);
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-12">Create a new User</h1>
            {/* <Link to="/admin/users" className="inline-block font-bold bg-[#023e8a] text-white rounded-[10px] p-2 mb-8">
                <span className="fa-solid fa-chevron-left"></span> Go to User List
            </Link> */}
            
            <p className="text-xl pb-8">With this form you can create and add a new <span className="text-[#AE0303] font-bold">User</span></p>

            {error && <p className="text-red-600 font-bold pb-4">*** {error} ***</p>}
            {submitted && <p className="text-green-600 font-bold pb-4">{submitted}</p>}

            <form onSubmit={handleSubmit} className="text-xl">
                <div className="pb-4">
                    <label htmlFor="form_name" className="font-medium">Name: </label>
                    <input 
                        type="text" 
                        id="form_name" 
                        name="name" 
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_email" className="font-medium">Email: </label>
                    <input 
                        type="email" 
                        id="form_email" 
                        name="email" 
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="pb-4">
                    <label htmlFor="form_password" className="font-medium">Password: </label>
                    <input 
                        type="password" 
                        id="form_password" 
                        name="password" 
                        className="py-2 px-4 w-[40%] rounded-[10px] border-2 border-[#AE0303]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-[#52b788] py-4 px-12 hover:bg-[#2d6a4f] hover:text-white duration-500 rounded-[20px]">Create</button>
                </div>
            </form>
        </div>
    );
}
