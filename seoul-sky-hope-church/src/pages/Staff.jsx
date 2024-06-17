import { useState, useEffect } from "react";

export default function Staff() {

    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const getStaff = async () => {
            let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/staff", { method: "get" });
            let data = await response.json();
            console.log("staff api:", data);
            setStaff(data);
        }
        getStaff();
    }, [])

    return(
        <div className="max-w-[1400px] mx-auto px-4 pb-12">
            <h1 className="text-5xl text-center font-bold py-8 px-4">Meet our Team</h1>
            {
                staff.map((person) => {
                    if(person.charge.toLowerCase().includes("pastor")){
                        return(
                            <div className="text-center text-2xl pb-12">
                                <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${person.image}`} className="w-[500px] h-[300px] object-cover rounded-[20px] mx-auto" alt={`Image of ${person.charge}`} />
                                <p className="pt-4 pb-2">{person.people}</p>
                                <p className="font-bold">{person.charge}</p>
                            </div>
                        )
                    }
                })
            }
            <div className="flex flex-wrap justify-around gap-x-16 gap-y-12">
                {
                    staff.map((person) => {
                        if(!person.charge.toLowerCase().includes("pastor")){
                            return(
                                <div className="text-center text-2xl">
                                    <img src={`https://seoul-sky-hope-church-api.vercel.app/uploads/${person.image}`} className="w-[300px] h-[300px] object-cover rounded-full border-2 border-[#AE0303] mx-auto" alt={`Image of ${person.charge}`} />
                                    <p className="pt-4 pb-2">{person.people}</p>
                                    <p className="font-bold">{person.charge}</p>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    );
}