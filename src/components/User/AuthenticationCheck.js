import React from "react";
import { useNavigate } from "react-router-dom";

const AuthenticationCheck = (WrappedComponent) => {
  const WithAuthenticationCheck = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("auth-token");

    if (!isAuthenticated) {
      navigate("/signup");
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthenticationCheck;
};

export default AuthenticationCheck;
