import React, { useState, useRe, useEffect, useRef } from 'react';
import './Digitwheel.css';

const Digitwheel = ({ value, onChange }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0); 
  const wheelRef = useRef(null);

  // Fungsi untuk menangani mouse down
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startY.current = e.clientY; 
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    startY.current = e.clientY;
  };

  // Fungsi untuk menangani mouse move
  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaY = e.clientY - startY.current; 
      const sensitivity = 1; 
      const newRotation = rotation - deltaY / sensitivity;
      setRotation(newRotation % 360);

      const steps = Math.floor(newRotation / 36); 
      const newValue = (10 - (steps % 10)) % 10
      onChange = (newValue);

      startY.current = e.clientY;

      // if (steps !== 0) {
      //   let newValue = value - steps; 
      //   newValue = (newValue + 10) % 10; 
      //   onChange(newValue);
      //   startY.current = e.clientY; 
      }
    };
  


  useEffect(() => {
    const newRotation = (10 - value) * 36;
    setRotation(newRotation);
  }, [value]);

  return (
    <div
      ref={wheelRef}
      className="digit-wheel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} 
      style={{transform: `rotate(${rotation}deg)`}}
    >
      {Array.from({length: 10}, (_, i) => (
        <div key={i}className="digit-number">
          {(10 - i) % 10}
        </div>
      ))}
      
    </div>
  );
};

export default Digitwheel;