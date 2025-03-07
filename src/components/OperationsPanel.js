import React from 'react';

const OperationsPanel = ({ onOperation }) => {
  return (
    <div className="operations-grid">
      <button onClick={() => onOperation('add')}>+</button>
      <button onClick={() => onOperation('subtract')}>-</button>
      <button onClick={() => onOperation('multiply')}>×</button>
      <button onClick={() => onOperation('divide')}>÷</button>
      <button onClick={() => onOperation('equals')}>=</button>
    </div>
  );
};

export default OperationsPanel;