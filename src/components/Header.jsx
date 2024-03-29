import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import API from "../api/API";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const isAuthenticated = localStorage.getItem("token") !== null;
      setIsLoggedIn(isAuthenticated);
    };

    checkAuthentication();
  }, []);

  return (
    <div className="bg-light">
      <Navbar expand="md" className="d-flex justify-content-between">
        <Container>
          <div>
            <Navbar.Brand as={Link} to="/home" className="fw-bold" style={{ color: "#5CB85C" }}>
              conduit
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>
          <div>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/home" className={location.pathname === "/home" ? "text-black" : "text-muted"}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/signin" className={location.pathname === "/signin" ? "text-black" : "text-muted"}>
                  Sign in
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className={location.pathname === "/signup" ? "text-black" : "text-muted"}>
                  Sign up
                </Nav.Link>
              </Nav>
              {isLoggedIn && (
                <Nav className="ml-auto">
                  <Nav.Link as={Link} to="/home" className={location.pathname === "/home" ? "text-black" : "text-muted"}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/editor" className={location.pathname === "/editor" ? "text-black" : "text-muted"}>
                    <i className="ion-compose"></i>&nbsp;New Article
                  </Nav.Link>
                  <Nav.Link as={Link} to="/settings" className={location.pathname === "/settings" ? "text-black" : "text-muted"}>
                    <i className="ion-gear-a"></i>&nbsp;Settings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/profile" className={location.pathname === "/profile" ? "text-black" : "text-muted"}>
                    <i className="ion-person"></i>&nbsp;Profile
                  </Nav.Link>
                </Nav>
              )}
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
