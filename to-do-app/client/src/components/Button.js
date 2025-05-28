import * as React from 'react';
import { useNavigate } from "react-router-dom";
import '../css/button_style.css';

const Button = ({ children, url, submit }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (submit) {
      event.preventDefault(); // Prevent default navigation
      event.target.closest("form")?.requestSubmit(); // Submit the form
    } else {
      navigate(url);
    }
  };

  return (
    <div className="button">
      <button onClick={handleClick} className="main-button" type="button">
        {children}
      </button>
    </div>
  );
};

export default Button;
