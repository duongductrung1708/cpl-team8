import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./css/styles.css";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import "./css/mobile.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

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
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(theme.palette.mode === "dark");

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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
      document.body.classList.toggle("dark-mode", JSON.parse(storedDarkMode));
    }
  }, []);

  const appliedTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={appliedTheme}>
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
                <FormGroup>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        name="darkModeSwitch"
                      />
                    }
                  />
                </FormGroup>
              </Navbar.Collapse>
            </div>
          </Container>
        </Navbar>
      </div>
    </ThemeProvider>
  );
};

export default Header;
