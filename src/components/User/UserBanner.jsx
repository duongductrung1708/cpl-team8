import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "../css/styles.css";
import SettingsIcon from "@mui/icons-material/Settings";

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
          <div className="user-info text-center">
            <Container>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  <img
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
                      className="setting-btn btn btn-sm btn-outline-secondary action-btn"
                      to={"/settings"}
                    >
                      <SettingsIcon fontSize="small" /> Edit Profile Settings
                    </Link>
                  ) : (
                    <button
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
                <div className="articles-toggle">
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
                            ? "top-bar nav-link active"
                            : "top-bar nav-link deactive"
                        }
                        to={`/profile/${username}`}
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
                            ? "top-bar nav-link active"
                            : "top-bar nav-link "
                        }
                        to={`/profile/${username}/favorites`}
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
