import React from 'react';

/**
 * Renders an error message for form input validation. Will not render if no message is provided.
 *
 * @param {Object} props
 * @param {string} props.message - The error message to display.
 * @param {string} props.id - The id for the error message element.
 * @returns {JSX.Element|null} Error message element or null if no message.
 */
function InputError({ message, id }) {
  if (!message) return null;

  return (
    <div aria-live="assertive" role="alert" id={id} className="error-message">
      {message}
    </div>
  );
}
export default InputError;
