import { useState } from 'react';
export const useWindowPosition = ({ width, height, margin }) => {
    const [position, setPosition] = useState(() => ({
        x: window.innerWidth - width - margin,
        y: window.innerHeight - height - 48
    }));
    const resetPosition = () => {
        setPosition({
            x: window.innerWidth - width - margin,
            y: window.innerHeight - height - 48
        });
    };
    return { position, setPosition, resetPosition };
};
