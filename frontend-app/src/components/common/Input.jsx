import React from 'react';
import './Input.css';

const Input = ({ label, id, error, ...props }) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <div className="input-wrapper">
                <input
                    id={id}
                    className={`form-input ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="error-text animate-fade-in">{error}</span>}
        </div>
    );
};

export default Input;
