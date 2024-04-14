import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/styles.css";
import SettingsIcon from '@mui/icons-material/Settings';

const getUserProfileByUsername = async (username) => {
  try {
    const authToken = localStorage.getItem("auth-token") || "";
    const response = await fetch(
      `https://api.realworld.io/api/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const followUser = async (username, isFollowing) => {
  try {
    const authToken = localStorage.getItem("auth-token") || "";
    const method = isFollowing ? "DELETE" : "POST";
    const response = await fetch(
      `https://api.realworld.io/api/profiles/${username}/follow`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle follow status");
    }

    return response.json();
  } catch (error) {
    console.error("Error toggling follow status:", error);
    throw error;
  }
};

const UserBanner = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [authenticatedUsername, setAuthenticatedUsername] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const authUsername = localStorage.getItem("auth-username");
    setAuthenticatedUsername(authUsername);

    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfileByUsername(username);
        setUserProfile(profileData.profile);
        setIsFollowing(profileData.profile.following);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [username]);

  const handleToggleFollow = async () => {
    try {
      if (!localStorage.getItem("auth-token")) {
        nav("/signup");
        return;
      }
      const updatedProfile = await followUser(username, isFollowing);
      setIsFollowing(updatedProfile.profile.following);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="profile-page">
      {userProfile && (
        <>
          <div
            className="user-info text-center"
            style={{ background: "#f3f3f3", padding: "2rem 0 1rem" }}
          >
            <Container>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "100px",
                      marginBottom: "1rem",
                    }}
                    src={userProfile.image}
                    className="user-img"
                    alt="profile avatar"
                  />
                  <h4 style={{ fontWeight: "700", fontSize: "1.5rem" }}>
                    {userProfile.username}
                  </h4>
                  <p>{userProfile.bio}</p>
                  {authenticatedUsername === username ? (
                    <Link
                      style={{
                        float: "right",
                        color: "#999",
                        border: "1px solid #999",
                        padding: ".25rem .5rem",
                        fontSize: ".875rem",
                        borderRadius: ".2rem",
                        backgroundImage: "none",
                        backgroundColor: "transparent",
                      }}
                      className="setting-btn btn btn-sm btn-outline-secondary action-btn"
                      to={"/settings"}
                    >
                      <SettingsIcon fontSize="small" />{" "}
                      Edit Profile Settings
                    </Link>
                  ) : (
                    <button
                      style={{
                        float: "right",
                        color: "#999",
                        border: "1px solid #999",
                        padding: ".25rem .5rem",
                        fontSize: ".875rem",
                        borderRadius: ".2rem",
                        backgroundImage: "none",
                        backgroundColor: "transparent",
                      }}
                      className="setting-btn btn btn-sm action-btn btn-outline-secondary"
                      onClick={handleToggleFollow}
                    >
                      {isFollowing ? "- Unfollow" : "+ Follow"}{" "}
                      {userProfile.username}
                    </button>
                  )}
                </div>
              </div>
            </Container>
          </div>
          <Container>
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <div
                  className="articles-toggle"
                  style={{ margin: "1.5rem 0 -1px" }}
                >
                  <ul
                    className="nav nav-pills outline-active"
                    style={{
                      paddingLeft: "0",
                      marginBottom: "0",
                      listStyle: "none",
                    }}
                  >
                    <li className="nav-item" style={{ float: "left" }}>
                      <NavLink
                        className={
                          location.pathname === `/profile/${username}`
                            ? "nav-link active"
                            : "nav-link deactive"
                        }
                        to={`/profile/${username}`}
                        style={{
                          borderRadius: "0",
                          border: "none",
                          borderBottom: "2px solid transparent",
                          background: "0 0",
                          color: "#aaa",
                          textDecoration: "none",
                          display: "block",
                          padding: ".5em 1em",
                        }}
                      >
                        My Articles
                      </NavLink>
                    </li>
                    <li
                      className="nav-item"
                      style={{ marginLeft: ".2rem", float: "left" }}
                    >
                      <NavLink
                        className={
                          location.pathname === `/profile/${username}/favorites`
                            ? "nav-link active"
                            : "nav-link "
                        }
                        to={`/profile/${username}/favorites`}
                        style={{
                          borderRadius: "0",
                          border: "none",
                          borderBottom: "2px solid transparent",
                          background: "0 0",
                          color: "#aaa",
                          textDecoration: "none",
                        }}
                      >
                        Favorited Articles
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}
    </div>
  );
};

export default UserBanner;