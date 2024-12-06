import React from 'react';


export const Table = ({ children, className }) => {
  return (
    <table className={`table ${className}`}>
      {children}
    </table>
  );
};


export const TableBody = ({ children }) => {
  return (
    <tbody>
      {children}
    </tbody>
  );
};


export const TableHead = ({ children }) => {
  return (
    <thead>
      {children}
    </thead>
  );
};


export const TableRow = ({ children }) => {
  return (
    <tr>
      {children}
    </tr>
  );
};


export const TableCell = ({ children }) => {
  return (
    <td>
      {children}
    </td>
  );
};


export const TableHeader = ({ children }) => {
  return (
    <th>
      {children}
    </th>
  );
};

