import React from 'react';

export const Button = ({ children, onClick, type = 'button', className }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
};
