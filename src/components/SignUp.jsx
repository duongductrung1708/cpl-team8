import React, { useState } from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Fade,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./css/styles.css";
import { Form, Row, Col } from "react-bootstrap";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    showPassword: false,
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [open, setOpen] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showPassword: !prevFormData.showPassword,
    }));
  };

  const signup = async (e) => {
    e.preventDefault();
    console.log("signup", formData);

    try {
      const response = await fetch("https://api.realworld.io/api/users", {
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
        window.location.replace("/home");
      } else {
        if (responseData.errors) {
          const messages = Object.values(responseData.errors).flatMap(
            (error) => error
          );
          setErrorMessages(messages);
          setOpen(true);
        } else {
          setErrorMessages(["An error occurred. Please try again."]);
          setOpen(true);
        }
        console.error("Error:", responseData.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessages(["An error occurred. Please try again."]);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fade in={true}>
      <div className="auth-page">
        <Container style={{ marginTop: "1.5rem" }}>
          <Row className="justify-content-md-center">
            <Col md={6}>
              <h1 className="text-center">Sign up</h1>
              <p className="text-center">
                <Link
                  to={"/signin"}
                  className="text-decoration-none"
                  style={{ color: "#5CB85C" }}
                >
                  Have an account?
                </Link>
              </p>
              <Form>
                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: "0.3rem",
                      border: "1px solid",
                    }}
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={changeHandler}
                  />
                </Form.Group>
                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: "0.3rem",
                      border: "1px solid",
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
                      border: "1px solid",
                    }}
                    type={formData.showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                  />
                  {formData.showPassword ? (
                    <VisibilityOffIcon
                      className="eye-position1"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <VisibilityIcon
                      className="eye-position1"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </Form.Group>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  style={{ float: "right" }}
                  onClick={(e) => signup(e)}
                >
                  Sign Up
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
        <Footer />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {errorMessages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fade>
  );
};

export default SignUp;
