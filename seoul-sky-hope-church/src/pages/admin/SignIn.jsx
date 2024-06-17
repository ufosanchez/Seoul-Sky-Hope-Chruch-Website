import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        const userCredentials = { email, password };

        try {
            const response = await fetch('https://seoul-sky-hope-church-api.vercel.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userCredentials),
            });

            if (response.ok) {
                console.log('Login successful');
                // Redirigir al usuario a la página deseada después del inicio de sesión
                navigate('/admin/dashboard');
            } else {
                console.error('Failed to login');
                setError("Invalid email or password. Please try again.");
            }
        } catch (error) {
            console.error('An error occurred', error);
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="max-w-lg mx-auto px-6 pb-12 bg-white shadow-[0_0_50px_5px_rgba(0,0,0,0.5)] rounded-lg my-12">
            <h1 className="font-[Montserrat] font-bold text-5xl text-center pt-8 pb-8 text-gray-800">Login</h1>
            
            <form onSubmit={handleSubmit} className="text-lg">
                {error && <p className="text-red-600 font-bold pb-4">{error}</p>}

                <div className="pb-6">
                    <label htmlFor="form_email" className="font-medium text-gray-700 block mb-2">Email</label>
                    <input 
                        type="email" 
                        id="form_email" 
                        name="email" 
                        className="py-3 px-4 w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="pb-6">
                    <label htmlFor="form_password" className="font-medium text-gray-700 block mb-2">Password</label>
                    <input 
                        type="password" 
                        id="form_password" 
                        name="password" 
                        className="py-3 px-4 w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-blue-600 text-white py-3 px-8 hover:bg-blue-700 transition duration-300 rounded-full text-xl">Login</button>
                </div>
            </form>
        </div>
    );
}
