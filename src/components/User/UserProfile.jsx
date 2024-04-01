import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Footer from "../Footer";

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

const getUserArticlesByUsername = async (username) => {
  try {
    const response = await fetch(
      `https://api.realworld.io/api/articles?limit=5&offset=0&author=${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user articles");
    }

    const userArticles = await response.json();
    return userArticles.articles;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};



const UserProfile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userArticles, setUserArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfileByUsername(username);
        setUserProfile(profileData.profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    const fetchUserArticles = async () => {
      try {
        const articlesData = await getUserArticlesByUsername(username);
        setUserArticles(articlesData);
      } catch (error) {
        console.error("Error fetching user articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
    fetchUserArticles();
    
  }, [username]);
  

 
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
                    className="btn btn-sm btn-outline-secondary action-btn"
                    to={"/settings"}
                    previewlistener="true"
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
                      <Link
                        className="nav-link active"
                        to={""}
                        previewlistener="true"
                        style={{
                          background: "#fff",
                          borderBottom: "2px solid #5cb85c",
                          color: "#5cb85c",
                        }}
                      >
                        My Articles
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      style={{ marginLeft: ".2rem", float: "left" }}
                    >
                      <Link
                        className="nav-link "
                        to={`/profile/${username}/favorites`}
                        previewlistener="true"
                        style={{
                          borderRadius: "0",
                          border: "none",
                          borderBottom: "2px solid transparent",
                          background: "0 0",
                          color: "#aaa",
                        }}
                      >
                        Favorited Articles
                      </Link>
                    </li>
                  </ul>
                </div>
                {isLoading && <div>Loading articles...</div>}
                {userArticles.length > 0 ? (
                  userArticles.map((article) => (
                    <div
                      key={article.slug}
                      className="article-preview"
                      style={{
                        borderTop: "1px solid rgba(0,0,0,.1)",
                        padding: "1.5rem 0",
                      }}
                    >
                      <div
                        className="article-meta"
                        style={{
                          margin: "0 0 1rem",
                          display: "block",
                          position: "relative",
                          fontWeight: "300",
                        }}
                      >
                        <Link
                          to={`/profile/${username}`}
                          previewlistener="true"
                          style={{
                            touchAction: "manipulation",
                            color: "#5cb85c",
                            textDecoration: "none",
                            background: "transparent",
                          }}
                        >
                          <img
                            decoding="sync"
                            src={userProfile.image}
                            alt="author avater"
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                              height: "32px",
                              width: "32px",
                              borderRadius: "30px",
                              border: "0",
                            }}
                          />
                        </Link>
                        <div
                          className="info"
                          style={{
                            margin: "0 1.5rem 0 .3rem",
                            display: "inline-block",
                            verticalAlign: "middle",
                            lineHeight: "1rem",
                          }}
                        >
                          <Link
                            style={{
                              display: "block",
                              fontWeight: "500",
                              touchAction: "manipulation",
                              color: "#5cb85c",
                              textDecoration: "none",
                              backgroundColor: "transparent",
                            }}
                            className="author"
                            to={`/profile/${username}`}
                            previewlistener="true"
                          >
                            {userProfile.username}
                          </Link>
                          <span
                            className="date"
                            style={{
                              color: "#bbb",
                              fontSize: ".8rem",
                              display: "block",
                              lineHeight: "1rem",
                              fontWeight: "300",
                            }}
                          >
                            {new Date(article.createdAt).toDateString()}
                          </span>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary pull-xs-right"
                          style={{
                            float: "right",
                            padding: ".25rem .5rem",
                            fontSize: ".875rem",
                            borderRadius: "0.2rem",
                            color: "#5cb85c",
                            backgroundImage: "none",
                            backgroundColor: "transparent",
                            borderColor: "#5cb85c",
                            display: "inline-block",
                            fontWeight: "400",
                            lineHeight: "1.25",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                            cursor: "pointer",
                            userSelect: "none",
                            border: "1px solid #5cb85c",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-suit-heart-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                          </svg>{" "}
                          {article.favoritesCount}
                        </button>
                      </div>
                      <Link
                        className="preview-link"
                        to={`/article/${article.slug}`}
                        previewlistener="true"
                        style={{
                          color: "inherit",
                          touchAction: "manipulation",
                          textDecoration: "none",
                          background: "transparent",
                        }}
                      >
                        <h1
                          style={{
                            fontWeight: "600",
                            fontSize: "1.5rem",
                            marginBottom: "3px",
                            margin: ".67em 0",
                            marginTop: "0",
                          }}
                        >
                          {article.title}
                        </h1>
                        <p
                          style={{
                            fontWeight: "300",
                            color: "#999",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            lineHeight: "1.3rem",
                            marginTop: "0",
                          }}
                        >
                          {article.description}
                        </p>
                        <span
                          style={{
                            maxWidth: "30%",
                            fontSize: ".8rem",
                            fontWeight: "300",
                            color: "#bbb",
                            verticalAlign: "middle",
                          }}
                        >
                          Read more...
                        </span>
                        <ul
                          className="tag-list"
                          style={{
                            float: "right",
                            maxWidth: "50%",
                            verticalAlign: "top",
                            paddingLeft: "0",
                            display: "inline-block",
                            listStyle: "none",
                            marginTop: "0",
                            marginBottom: "1rem",
                          }}
                        >
                          {article.tagList.map((tag) => (
                            <li
                              key={tag}
                              className="tag-default tag-pill tag-outline"
                              style={{
                                fontWeight: "300",
                                fontSize: ".8rem",
                                paddingTop: "0",
                                paddingBottom: "0",
                                border: "1px solid #ddd",
                                color: "#aaa",
                                background: "0 0",
                                display: "inline-block",
                                whiteSpace: "nowrap",
                                marginRight: "3px",
                                marginBottom: "0.2rem",
                                paddingRight: ".6em",
                                paddingLeft: ".6em",
                                borderRadius: "10rem",
                              }}
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center">No articles are here... yet.</div>
                )}
              </div>
            </div>
          </Container>
        </>
      )}
      <Footer />
    </div>
  );
};

export default UserProfile;
