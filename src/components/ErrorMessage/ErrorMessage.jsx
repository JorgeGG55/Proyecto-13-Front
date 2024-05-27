import React from 'react';

const ErrorMessage = ({ message }) => {
  return message ? <p className="errorMessage">{message}</p> : null;
};

export default ErrorMessage;
