import React from 'react';

const Display = ({ value, mode }) => {
  return (
    <div className="display">
      <div>{mode === 'decimal' ? 'Decimal' : 'Hexadecimal'}: {value}</div>
    </div>
  );
};

export default Display; 