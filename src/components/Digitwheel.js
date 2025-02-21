import React, { useRef, useState } from "react";
import './Digitwheel.css';

const Digitwheel = ({value, onchange}) => {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startY.current = e.clientY;
    };

    const handleMOuseMove = (e) => {
        if (isDragging) {
            const deltaY = e.clientY - startY.current;
            const sensivity = 5;
            const steps = Math.floor(deltaY / sensivity);

            if (step !== 0) {
                let newValue = value - steps;
                newValue = (newValue + 10) % 10;
                onChange(newValue);
                startY.current = e.clientY;
           }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
    <div 
      className="digit-wheel" 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >

        {value}

    </div>
       );
    
    };
export default Digitwheel;