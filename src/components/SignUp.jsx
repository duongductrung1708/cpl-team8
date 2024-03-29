import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="auth-page">
    <Container style={{marginTop: "1.5rem"}}>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center">Sign Up</h1>
          <p className="text-center">
            <Link to={"/signin"} className="text-decoration-none" style={{color: "#5CB85C"}}>Have an account?</Link>
          </p>
          <Form onSubmit={handleSubmit}>
          <Form.Group style={{marginBottom: "1rem"}}>
              <Form.Control
              style={{padding: "0.75rem 1.5rem", fontSize: "1.25rem", borderRadius: "0.3rem"}}
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group style={{marginBottom: "1rem"}}>
              <Form.Control
              style={{padding: "0.75rem 1.5rem", fontSize: "1.25rem", borderRadius: "0.3rem"}}
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group style={{marginBottom: "1rem"}}>
              <Form.Control
              style={{padding: "0.75rem 1.5rem", fontSize: "1.25rem", borderRadius: "0.3rem"}}
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-lg btn-block" style={{backgroundColor: "#5CB85C", borderColor: "#5CB85C", float: "right"}}>
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default SignUp