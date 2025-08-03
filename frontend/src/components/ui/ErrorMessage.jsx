import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const ErrorMessage = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [message]);

  if (!message) {
    return null;
  }

  const handleInteraction = () => {
    setIsExpanded(true);
  };
  
  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div 
      className={`error-display ${isExpanded ? 'is-expanded' : ''}`}
      onMouseEnter={handleInteraction}
      onClick={handleInteraction}
      onMouseLeave={handleMouseLeave}
    >
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className="error-display__icon"
      />
      <span className="error-display__message">{message}</span>
    </div>
); };

export default ErrorMessage;