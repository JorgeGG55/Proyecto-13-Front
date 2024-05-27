import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { register as registerRoute } from "../../utils/APIRoutes";
import { useAuth } from "../../hooks/useAuth";
import { Toaster, toast } from "sonner";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [inputErrors, setInputErrors] = useState({
    name: false,
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
    const errors = {
      name: !formData.name,
      email: !formData.email,
      password: !formData.password,
    };
    setInputErrors(errors);
    if (errors.name && errors.email && errors.password) {
      setErrorMessage("All fields are required.");
    } else if (errors.name) {
      setErrorMessage("Name is required.");
    } else if (errors.email) {
      setErrorMessage("Email is required.");
    } else if (errors.password) {
      setErrorMessage("Password is required.");
    }
    return !errors.name && !errors.email && !errors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(registerRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          setInputErrors({ name: true, email: true, password: true });
          toast.error(errorData.message || "Invalid registration details.");
        } else {
          throw new Error(errorData.message || "Failed to register");
        }
        return;
      }

      toast.success("Account created successfully! Redirecting to home...");
      const data = await response.json();
      setTimeout(() => {
        authLogin(data.token);
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="form-container sign-up-container">
        <form className="formContent" onSubmit={handleSubmit}>
          <h1 className="formTitle">Create Account</h1>
          <input
            type="text"
            name="name"
            placeholder="Name and surname"
            value={formData.name}
            onChange={handleInputChange}
            className={inputErrors.name ? "error" : ""}
          />
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
            <span>{isLoading ? "Signing Up..." : "Sign Up"}</span>
            {isLoading && <LoadingSpinner />}
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
