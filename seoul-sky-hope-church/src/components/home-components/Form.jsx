import { useState, useEffect, useRef } from "react";

import emailjs from "@emailjs/browser";

export default function Form() {

    /* --- API --- */

    const [basicInfo, setBasicInfo] = useState({});

    useEffect(() => {
        const getBasicInfo = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/basicinfo", { method: "get" });
            let data = await response.json();
            /* console.log("form:", data); */
            setBasicInfo(data);
        }
        getBasicInfo();
    }, [])

    /* --- API --- */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const formRef = useRef()
    const [form, setForm] = useState(
        {
            name : "",
            email : "",
            message : ""
        }
    )

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]:value })
    }

    const handleSubmit = (e) => {

        let error_message = document.getElementById("error-message")

        e.preventDefault();

        if(form.name === "" || !emailRegex.test(form.email) || form.message === ""){
            console.log("Wrong inputs");
            error_message.innerHTML = "Sorry, provide valid information in all inputs, thanks!"
        } else{
            error_message.innerHTML = ""
            setLoading(true);
        
            emailjs.send(
                "service_72gskgo",
                "template_fm1w31j",
                {
                    from_name : form.name,
                    to_name : "Arnulfo Sanchez",
                    from_email: form.email,
                    to_email : "SanchezPena.Arnulfo@gmail.com",
                    message : form.message
                },
                "qWA1vp2oMw84KdeIm"
            )
            .then(() => {
                setLoading(false)
                alert("Thank you for your message!")

                setForm({
                    name : "",
                    email : "",
                    message : ""
                })
            }, (error) => {
                setLoading(false)
                console.log(error);

                alert("Something went wrong")
            })
        }
        
    }

    return(
        <div id="contact-component" className="max-w-[1400px] mx-auto px-4 pb-12">
            <h2 className="font-[Montserrat] font-bold text-[32px] pb-4">Are you new and want to connect?</h2>
            <p className="text-2xl pb-4">{basicInfo.form}</p>

            <form ref={formRef} onSubmit={handleSubmit} className="font-[Montserrat] text-[32px] max-w-[992px] mx-auto">
                <span id="error-message" className="text-red-600 font-bold pb-4"></span>
                <div className="flex flex-col md:flex-row md:items-center md:flex-wrap pb-4">
                    <label htmlFor="f_name" className="font-bold md:basis-[215px]">Name:</label>
                    <input type="text" id="f_name" name="name" value={form.name} onChange={handleChange} placeholder="What's your name?" className="flex-1 md:basis-[450px] py-2 px-4 rounded-xl placeholder:text-black border-2 border-[#AE0303]"/>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:flex-wrap pb-4">
                    <label htmlFor="f_email" className="font-bold md:basis-[215px]">Email:</label>
                    <input type="email" id="f_email" name="email" value={form.email} onChange={handleChange} placeholder="What's your email?" className="flex-1 md:basis-[450px] py-2 px-4 rounded-xl placeholder:text-black border-2 border-[#AE0303]"/>
                </div>

                <div className="flex items-start flex-wrap pb-4">
                    <label htmlFor="f_message" className="font-bold basis-[215px]">Message:</label>
                    <textarea id="f_message" name="message" value={form.message} onChange={handleChange} placeholder="Please provide your message here" rows="7" className="flex-1 basis-[450px] py-2 px-4 rounded-xl placeholder:text-black border-2 border-[#AE0303]"/>
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-[#AE0303] py-4 px-12 text-white hover:bg-[#553655] duration-500 rounded-[20px]">
                        {
                            loading ? "Sending..." : "Submit"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}