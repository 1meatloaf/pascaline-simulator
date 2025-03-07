import React from 'react';

const ColorPreview = ({ hexValue }) => {
  return (
    <div className="color-preview" style={{ backgroundColor: `#${hexValue}` }}>
      #{hexValue}
    </div>
  );
};

export default ColorPreview;