import React, { useState, useEffect } from "react";
import { Container, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../css/styles.css';

const getUserProfile = async () => {
  try {
    const response = await fetch("https://api.realworld.io/api/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${localStorage.getItem("auth-token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userData = await response.json();
    return userData.user;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const updateUserProfile = async (userData) => {
  try {
    const response = await fetch("https://api.realworld.io/api/user", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("auth-token")}`,
      },
      body: JSON.stringify({ user: userData }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        responseData.errors
          ? responseData.errors
          : "Failed to update user profile"
      );
    }

    const updatedUserData = await response.json();
    return updatedUserData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const Setting = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    bio: "",
    image: "",
    showPassword: false,
  });
  const [error, setError] = useState(null);
  const [confirmUpdateDialogOpen, setConfirmUpdateDialogOpen] = useState(false);
  const [confirmLogoutDialogOpen, setConfirmLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        setFormData((prevFormData) => ({
          ...prevFormData,
          email: user.email,
          username: user.username,
          bio: user.bio || "",
          image: user.image || "",
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/signin");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    document.querySelector(".footer").classList.remove("not-has-content");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(formData);
      setConfirmUpdateDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    setConfirmLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-username");
    navigate("/signin");
    window.location.reload();
  };

  return (
    <div>
      <div className="settings-page">
        <Container className="page" style={{ marginTop: "1.5rem" }}>
          <div className="row">
            <div
              className="col-md-6 offset-md-3 col-xs-12 position-relative"
              style={{
                minHeight: "1px",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <h1 className="text-center">Your Settings</h1>
              {error && (
                <ul className="text-danger fw-bold">
                  <li>{error}</li>
                </ul>
              )}
              <form onSubmit={(e) => { e.preventDefault(); setConfirmUpdateDialogOpen(true); }}>
                <fieldset>
                  <fieldset
                    className="form-group"
                    style={{ marginBottom: "1rem" }}
                  >
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      style={{
                        padding: ".75rem 1.5rem",
                        fontSize: "1.25rem",
                        borderRadius: ".3rem",
                      }}
                    />
                  </fieldset>
                  <fieldset
                    className="form-group"
                    style={{ marginBottom: "1rem" }}
                  >
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      style={{
                        padding: ".75rem 1.5rem",
                        fontSize: "1.25rem",
                        borderRadius: ".3rem",
                      }}
                    />
                  </fieldset>
                  <fieldset
                    className="form-group"
                    style={{ marginBottom: "1rem" }}
                  >
                    <textarea
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      style={{
                        padding: ".75rem 1.5rem",
                        fontSize: "1.25rem",
                        borderRadius: ".3rem",
                      }}
                    ></textarea>
                  </fieldset>
                  <fieldset
                    className="form-group"
                    style={{ marginBottom: "1rem" }}
                  >
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      style={{
                        padding: ".75rem 1.5rem",
                        fontSize: "1.25rem",
                        borderRadius: ".3rem",
                      }}
                      disabled
                    />
                  </fieldset>
                  <fieldset
                    className="form-group"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div className="password-input-container">
                      <input
                        className="form-control form-control-lg"
                        type={formData.showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                          padding: ".75rem 1.5rem",
                          fontSize: "1.25rem",
                          borderRadius: ".3rem",
                        }}
                      />
                      <div className="visibility-icon-container">
                        {formData.showPassword ? (
                          <VisibilityOffIcon className="eye-position2" onClick={(e) => { e.stopPropagation(); togglePasswordVisibility(); }} />
                        ) : (
                          <VisibilityIcon className="eye-position2" onClick={(e) => { e.stopPropagation(); togglePasswordVisibility(); }} />
                        )}
                      </div>
                    </div>
                  </fieldset>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary"
                    style={{
                      float: "right",
                      padding: ".75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: ".3rem",
                      backgroundColor: "#5cb85c",
                      borderColor: "#5cb85c",
                    }}
                  >
                    Update Settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button
                className="btn btn-outline-danger"
                style={{ marginBottom: "5rem" }}
                onClick={() => setConfirmLogoutDialogOpen(true)}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
      <Dialog
        open={confirmUpdateDialogOpen}
        onClose={() => setConfirmUpdateDialogOpen(false)}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update your profile?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" color="success">Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmLogoutDialogOpen}
        onClose={() => setConfirmLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmLogout} variant="contained" color="error">Logout</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Setting;
