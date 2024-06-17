import { useState } from "react";

export default function Accordion({ category, description, isOpen, onClick }) {
    return (
        <div className="basis-[45%] p-4 bg-gray-200 rounded-lg border-2 border-[#AE0303] mb-2">
            <button
                onClick={onClick}
                className="flex justify-between w-full"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${category}`}
            >
                <span className="font-[Montserrat] text-2xl font-bold">{category}</span>
                {isOpen ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}
            </button>
            <div
                id={`accordion-content-${category}`}
                className={`transition-max-height duration-700 ease-in-out overflow-hidden
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-2">{description}</div>
            </div>
        </div>
    );
}
