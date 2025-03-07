import React from "react";

const DisplayBar = ({ value, isComplement }) => {
    return (
        <div className="display-bar">
            {isComplement ? `Complement: ${value}` : `Value ${value}`}
        </div>
    );
};

export default DisplayBar;