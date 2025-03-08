import React from 'react';

const ModeSwitch = ({ mode, toggleMode, autoCalculate, toggleAutoCalculate }) => {
  return (
  <div className='mode-switch-container'>
    <div className="mode-switch">
      <label className='switch'>
        <input type="checkbox" checked={mode === 'hex'} onChange={toggleMode} />
      <span className='slider'></span>
      </label>
      <span>{mode === 'decimal' ? 'Decimal' : 'Hexadecimal'}</span>
    </div>
    <dev className="auto-calculate-switch">
      <label className='switch'>
        <input type='checkbox' checked={autoCalculate} onChange={toggleAutoCalculate} />
        <span className='slider'></span>
      </label>
      <span>Auto Calculation</span>
    </dev>
  </div>
  );
};

export default ModeSwitch;