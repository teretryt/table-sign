import React from "react";

const VerifiedIcon = ({bg, content}) => {
    return (
        <li className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="13" className={`${bg}`} />
                <path
                    d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                    stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="font-normal text-base text-gray-900 ">{content}</span>
        </li>
    );
}

export default VerifiedIcon;