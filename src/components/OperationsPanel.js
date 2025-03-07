import React from "react";

const OperationsPanel = ({ onOperation, onReset }) => {
    return (
        <div className="operations-panel">
            <button onClick={() => onOperation('add')}>+</button>
            <button onClick={() => onOperation('subtract')}>-</button>
            <button onClick={() => onOperation('multiply')}>*</button>
            <button onClick={() => onOperation('divide')}>/</button>
            <button onClick={onReset}>Reset</button>
        </div>
    );
};

export default OperationsPanel;