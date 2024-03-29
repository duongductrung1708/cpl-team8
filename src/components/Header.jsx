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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                    &nbsp;New Article
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-gear-wide"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                    </svg>
                    &nbsp;Settings
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
