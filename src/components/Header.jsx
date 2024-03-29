import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const getUserInfo = async () => {
  try {
    const response = await fetch("https://api.realworld.io/api/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${localStorage.getItem("auth-token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user information");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = localStorage.getItem("auth-token") !== null;
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated) {
        try {
          const userData = await getUserInfo();
          setUsername(userData.user.username);
        } catch (error) {
          console.error("Error getting user information:", error);
        }
      }
    };

    checkAuthentication();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("auth-token");
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <div className="bg-light">
      <Navbar expand="md" className="d-flex justify-content-between">
        <Container>
          <div>
            <Navbar.Brand
              as={Link}
              to="/home"
              className="fw-bold"
              style={{ color: "#5CB85C" }}
            >
              conduit
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>
          <div>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link
                  as={Link}
                  to="/home"
                  className={
                    location.pathname === "/home" ? "text-black" : "text-muted"
                  }
                >
                  Home
                </Nav.Link>
                {!isLoggedIn && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/signin"
                      className={
                        location.pathname === "/signin"
                          ? "text-black"
                          : "text-muted"
                      }
                    >
                      Sign in
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/signup"
                      className={
                        location.pathname === "/signup"
                          ? "text-black"
                          : "text-muted"
                      }
                    >
                      Sign up
                    </Nav.Link>
                  </>
                )}
              </Nav>
              {isLoggedIn && (
                <Nav className="ml-auto">
                  <Nav.Link
                    as={Link}
                    to="/editor"
                    className={
                      location.pathname === "/editor"
                        ? "text-black"
                        : "text-muted"
                    }
                  >
                    <i className="ion-compose"></i>&nbsp;New Article
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/settings"
                    className={
                      location.pathname === "/settings"
                        ? "text-black"
                        : "text-muted"
                    }
                  >
                    <i className="ion-gear-a"></i>&nbsp;Settings
                  </Nav.Link>
                  {username && (
                    <Nav.Link
                      as={Link}
                      to={`/profile/${username}`}
                      className={
                        location.pathname === "/settings"
                          ? "text-black"
                          : "text-muted"
                      }
                    >
                      <img
                        style={{
                          height: "26px",
                          borderRadius: "50px",
                          float: "left",
                          marginRight: "5px",
                        }}
                        src="https://api.realworld.io/images/smiley-cyrus.jpeg"
                        className="user-pic"
                        alt={username}
                      />
                      {username}
                    </Nav.Link>
                  )}
                  <Nav.Link onClick={handleSignOut} className="nav-link">
                    Sign Out
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
