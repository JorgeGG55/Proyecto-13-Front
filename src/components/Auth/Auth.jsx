import React, { useState } from "react";
import "./Auth.css";
import RegisterForm from "../RegisterForm/RegisterForm";
import LoginForm from "../LoginForm/LoginForm";

const OverlayPanel = ({ title, text, buttonText, onClick, className }) => (
  <div className={`overlay-panel ${className}`}>
    <h1 className="overlay-title">{title}</h1>
    <p className="formText">{text}</p>
    <button className="formButtons ghost" onClick={onClick}>
      {buttonText}
    </button>
  </div>
);

const Auth = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  return (
    <>
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        <RegisterForm />
        <LoginForm />
        <div className="overlay-container">
          <div className="overlay">
            <OverlayPanel
              title="Welcome Back!"
              text="Already have an account?"
              buttonText="Sign In"
              onClick={() => setIsSignUpActive(false)}
              className="overlay-left"
            />
            <OverlayPanel
              title="Hello, Friend!"
              text="Not a member yet?"
              buttonText="Sign Up"
              onClick={() => setIsSignUpActive(true)}
              className="overlay-right"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
