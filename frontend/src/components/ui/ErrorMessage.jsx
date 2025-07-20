import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-display">
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className="error-display__icon"
      />
      <span className="error-display__message">{message}</span>
    </div>
); };

export default ErrorMessage;