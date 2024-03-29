import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        email: "",
      });
    
      const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const login = async (e) => {
        e.preventDefault();
        console.log("login", formData);
        let responseData;
        await fetch("https://api.realworld.io/api/users/login", {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => (responseData = data));
    
        if (responseData.success) {
          localStorage.setItem("auth-token", responseData.token);
          nav("/");
        } else {
          alert(responseData.errors);
        }
      };

  return (
    <div className="auth-page">
      <Container style={{marginTop: "1.5rem"}}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h1 className="text-center">Sign in</h1>
            <p className="text-center">
              <Link to={"/signup"} className="text-decoration-none" style={{color: "#5CB85C"}}>Need an account?</Link>
            </p>
            <Form>
              <Form.Group style={{marginBottom: "1rem"}}>
                <Form.Control
                style={{padding: "0.75rem 1.5rem", fontSize: "1.25rem", borderRadius: "0.3rem"}}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                />
              </Form.Group>

              <Form.Group style={{marginBottom: "1rem"}}>
                <Form.Control
                style={{padding: "0.75rem 1.5rem", fontSize: "1.25rem", borderRadius: "0.3rem"}}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="btn-lg btn-block" style={{backgroundColor: "#5CB85C", borderColor: "#5CB85C", float: "right"}} onClick={(e) => login(e)}>
                Sign in
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
