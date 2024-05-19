import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./css/styles.css";
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import "./css/styles.css";

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
  const [userImage, setUserImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = localStorage.getItem("auth-token") !== null;
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated) {
        try {
          const userData = await getUserInfo();
          setUsername(userData.user.username);
          setUserImage(userData.user.image);
        } catch (error) {
          console.error("Error getting user information:", error);
        }
      }
    };

    checkAuthentication();
  }, []);

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
                    location.pathname === "/home"
                      ? "text-black"
                      : "text-secondary navhover"
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
                          : "text-secondary navhover"
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
                          : "text-secondary navhover"
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
                        : "text-secondary navhover"
                    }
                  >
                    <EditIcon fontSize="small" />
                    &nbsp;New Article
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/settings"
                    className={
                      location.pathname === "/settings"
                        ? "text-black"
                        : "text-secondary navhover"
                    }
                  >
                    <SettingsIcon fontSize="small" />
                    &nbsp;Settings
                  </Nav.Link>
                  {username && (
                    <Nav.Link
                      as={Link}
                      to={`/profile/${username}`}
                      className={
                        location.pathname === `/profile/${username}` ||
                        location.pathname === `/profile/${username}/favorites`
                          ? "text-black"
                          : "text-secondary navhover"
                      }
                    >
                      <img
                        style={{
                          height: "26px",
                          borderRadius: "50px",
                          float: "left",
                          marginRight: "5px",
                        }}
                        src={userImage}
                        className="user-pic img-fluid"
                        alt={username}
                      />
                      {username}
                    </Nav.Link>
                  )}
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
