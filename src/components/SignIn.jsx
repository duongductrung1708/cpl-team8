import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const SignIn = () => {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const [errorMessages, setErrorMessages] = useState([]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    console.log("login", formData);

    if (!formData.email || !formData.password) {
      setErrorMessages(["Email or Password can't be blank"]);
      return;
    }

    try {
      const response = await fetch("https://api.realworld.io/api/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: formData }),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("auth-token", responseData.user.token);
        localStorage.setItem("auth-username", responseData.user.username);
        window.location.replace("/home");
      } else {
        if (responseData.errors) {
          const messages = Object.values(responseData.errors).flatMap(
            (error) => error
          );
          setErrorMessages(["Email or Password is incorrect"]);
        } else {
          setErrorMessages(["Email or Password is incorrect"]);
        }
        console.error("Error:", responseData.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessages(["An error occurred. Please try again."]);
    }
  };

  return (
    <div className="auth-page">
      <Container style={{ marginTop: "1.5rem" }}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h1 className="text-center">Sign in</h1>
            <p className="text-center">
              <Link
                to={"/signup"}
                className="text-decoration-none"
                style={{ color: "#5CB85C" }}
              >
                Need an account?
              </Link>
            </p>
            {errorMessages && errorMessages.length > 0 && (
              <ul className="text-danger fw-bold" variant="danger">
                {errorMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            )}
            <Form>
              <Form.Group style={{ marginBottom: "1rem" }}>
                <Form.Control
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "1.25rem",
                    borderRadius: "0.3rem",
                  }}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: "1rem" }}>
                <Form.Control
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "1.25rem",
                    borderRadius: "0.3rem",
                  }}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="btn-lg btn-block"
                style={{
                  backgroundColor: "#5CB85C",
                  borderColor: "#5CB85C",
                  float: "right",
                }}
                onClick={(e) => login(e)}
              >
                Sign in
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default SignIn;
