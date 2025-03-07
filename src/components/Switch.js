import React from "react";

const Switch = ({ isDecimsl, toggleMode }) => {
    return (
        <div className="switch">
            <button onClick={toggleMode}>
                Switch to {isDecimsl ? 'Hexadecimal' : 'Decimal'}
            </button>
        </div>
    );
};

export default Switch;