import React from "react";

const LoadingPlaceholder = () => (
  <svg viewBox="0 0 100 4">
    <rect
      width="100%"
      height="100%"
      fill='url("#animertFarge")'
      clipPath="url(#yt9yg06-diff)"
    ></rect>
    <defs>
      <clipPath id="yt9yg06-diff">
        <rect width="80" height="4" x="0" y="0.5" rx="1"></rect>
      </clipPath>
      <linearGradient id="animertFarge">
        <stop offset="-1.384" stopColor="#d5d6d7">
          <animate
            attributeName="offset"
            dur="1.2s"
            keyTimes="0; 0.25; 1"
            repeatCount="indefinite"
            values="-2; -2; 1"
          ></animate>
        </stop>
        <stop offset="-0.384" stopColor="#e5e5e5">
          <animate
            attributeName="offset"
            dur="1.2s"
            keyTimes="0; 0.25; 1"
            repeatCount="indefinite"
            values="-1; -1; 2"
          ></animate>
        </stop>
        <stop offset="0.616" stopColor="#d5d6d7">
          <animate
            attributeName="offset"
            dur="1.2s"
            keyTimes="0; 0.25; 1"
            repeatCount="indefinite"
            values="0; 0; 3"
          ></animate>
        </stop>
      </linearGradient>
    </defs>
  </svg>
);

export default LoadingPlaceholder;
