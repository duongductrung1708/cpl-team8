import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
      throw new Error(responseData.errors ? responseData.errors : "Failed to update user profile");
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
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        setFormData({
          email: user.email,
          username: user.username,
          bio: user.bio || "",
          image: user.image || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/signin");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(formData);
      console.log("User profile updated:", updatedUser);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
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
              {error && <ul className="text-danger fw-bold">
                <li>{error}</li>
                </ul>}
              <form onSubmit={handleSubmit}>
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
                      onChange={handleChange}
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
                    <input
                      className="form-control form-control-lg"
                      type="password"
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
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Or click here to logout.
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Setting;
