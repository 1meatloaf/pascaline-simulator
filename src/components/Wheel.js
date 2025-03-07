import React from 'react';

const Wheel = ({ value, onChange }) => {
  return (
    <div className="wheel">
      <button onClick={() => onChange(1)}>+</button>
      <span>{value}</span>
      <button onClick={() => onChange(-1)}>-</button>
    </div>
  );
};

export default Wheel;