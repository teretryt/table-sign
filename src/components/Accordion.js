import React, { useState } from "react";

const Accordion = ({ header, content, children}) => {
  const [isOpen, setIsOpen] = useState(false); // Tekil bir accordion için basit bir state

  const toggleAccordion = () => {
    setIsOpen(!isOpen); // Açık/kapanır durumu değiştir
  };

  return (
    <div className="border-b">
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center py-4 px-6 text-left text-gray-700 font-medium focus:outline-none"
      >
        <span>{header}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 text-gray-600">
          {content} {/* İçerik buraya gelir */}
          {children} {/* İçerik buraya gelir */}
        </div>
      )}
    </div>
  );
};

export default Accordion;
