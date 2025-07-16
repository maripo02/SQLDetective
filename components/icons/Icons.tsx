
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const DatabaseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

export const SkullIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <path d="M8 20v2h8v-2"></path>
        <path d="M12.5 17.5c-.3.2-.5.5-.5.8v2h-1v-2c0-.3-.2-.6-.5-.8-.4-.2-.7-.6-.7-1v-4c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v4c0 .4-.3.8-.7 1z"></path>
        <path d="M16 20a4 4 0 0 0-8 0"></path>
        <path d="M12 2c-5 0-9 4-9 9 0 2.4.9 4.5 2.4 6.1.4.4.9.7 1.4.9l.4.2c1.1.5 2.3.8 3.5.8s2.4-.3 3.5-.8l.4-.2c.5-.2 1-.5 1.4-.9C20.1 15.5 21 13.4 21 11c0-5-4-9-9-9z"></path>
    </svg>
);
