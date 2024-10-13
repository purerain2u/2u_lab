import React from 'react';

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4C4.5 4 2 10 2 10C2 10 4.5 16 10 16C15.5 16 18 10 18 10C18 10 15.5 4 10 4Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {!isVisible && (
      <path d="M3 17L17 3" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
);

export default EyeIcon;
