import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import "../css/styles.css";

const getUserProfileByUsername = async (username) => {
  try {
    const response = await fetch(
      `https://api.realworld.io/api/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
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
    const method = isFollowing ? "DELETE" : "POST";
    const response = await fetch(
      `https://api.realworld.io/api/profiles/${username}/follow`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-gear-wide"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                      </svg>{" "}
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
                            : "nav-link deactive"
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
