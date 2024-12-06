import React from 'react';

export const Input = ({ id, value, onChange, type = 'text', required, disabled }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="input"
    />
  );
};
