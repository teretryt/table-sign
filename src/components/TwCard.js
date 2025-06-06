import React from "react";

function TwCard({ icon, title, content, linkHref }) 
{
  return (
    <div className="min-w-96 max-w-96 p-6 bg-red-700 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {icon && <div className="mb-3">{icon}</div>}
      <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white dark:text-white">
          {title}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-200 dark:text-gray-400">
        {content}
      </p>
      <a href={linkHref || "#"} className="inline-flex font-medium items-center text-white underline">
        Daha Fazla Bilgi
        <svg
          className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
          />
        </svg>
      </a>
    </div>
  );
}

export default TwCard;