import React, { useState } from "react";
import "./LoginForm.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { login as loginAPI } from "../../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
  });
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setInputErrors((prev) => ({ ...prev, [name]: false }));
    setErrorMessage("");
  };

  const validateInputs = () => {
    const errors = { email: !formData.email, password: !formData.password };
    setInputErrors(errors);
    if (errors.email && errors.password) {
      setErrorMessage("Email and password are required.");
    } else if (errors.email) {
      setErrorMessage("Email is required.");
    } else if (errors.password) {
      setErrorMessage("Password is required.");
    }
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;
    setIsLoading(true);

    try {
      const response = await fetch(loginAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Login successfully! Redirecting to home...");
        setTimeout(() => {
          authLogin(data.token);
          navigate("/");
        }, 2000);
      } else {
        setInputErrors({ email: true, password: true });
        toast.error("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="form-container sign-in-container">
        <form className="formContent" onSubmit={handleSubmit}>
          <h1 className="formTitle">Sign in</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className={inputErrors.email ? "error" : ""}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={inputErrors.password ? "error" : ""}
          />
          <ErrorMessage message={errorMessage} />
          <button
            className="formButtons m-10"
            type="submit"
            disabled={isLoading}
          >
            <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            {isLoading && <LoadingSpinner />}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
