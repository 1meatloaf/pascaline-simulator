import React from 'react';

const ModeSwitch = ({ mode, toggleMode }) => {
  return (
    <div className="mode-switch">
      <label>
        <input
          type="checkbox"
          checked={mode === 'hex'}
          onChange={toggleMode}
        />
        Switch to {mode === 'decimal' ? 'Hexadecimal' : 'Decimal'}
      </label>
    </div>
  );
};

export default ModeSwitch;