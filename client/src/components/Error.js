import React from "react";

const Error = ({ touched, message }) => {
  if (!touched) {
    return null;
  }
  if (message) {
    return <span className="error-text">{message}</span>;
  }
  return null;
};

export default Error;
