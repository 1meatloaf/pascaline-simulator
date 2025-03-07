import React from 'react';

const Wheel = ({ value, onChange, isActive }) => {
  return (
    <div className={`wheel ${isActive ? 'active' : ''}`}>
      <button onClick={() => onChange(1)}>+</button>
      <span>{value}</span>
      <button onClick={() => onChange(-1)}>-</button>
    </div>
  );
};

export default Wheel;