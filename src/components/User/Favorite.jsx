import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Footer from "../Footer";
import "../css/styles.css";
import UserBanner from "./UserBanner";

const getUserProfileByUsername = async (username) => {
  try {
    const response = await fetch(
      `https://api.realworld.io/api/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
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
      `https://api.realworld.io/api/articles?limit=5&offset=0&favorited=${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
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

const toggleFavoriteArticle = async (slug, isFavorited) => {
  try {
    const method = isFavorited ? "DELETE" : "POST";
    const response = await fetch(
      `https://api.realworld.io/api/articles/${slug}/favorite`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle favorite status");
    }

    const favoritedArticle = await response.json();
    console.log("Article favorited:", favoritedArticle);
    return favoritedArticle;
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw error;
  }
};

const Favorite = () => {
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
        const updatedArticles = articlesData.map((article) => ({
          ...article,
          favorited: true,
        }));
        setUserArticles(updatedArticles);
      } catch (error) {
        console.error("Error fetching user articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    fetchUserArticles();
  }, [username]);

  const handleToggleFavorite = async (slug, isFavorited) => {
    try {
      const updatedArticle = await toggleFavoriteArticle(slug, isFavorited);
      setUserArticles((prevUserArticles) => {
        const index = prevUserArticles.findIndex(
          (article) => article.slug === slug
        );
        const updatedArticles = [...prevUserArticles];
        updatedArticles[index] = updatedArticle.article;
        return updatedArticles;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="profile-page">
      {userProfile && (
        <>
          <UserBanner />
          <Container style={{marginBottom: "100px"}}>
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
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
                          to={`/profile/${article.author.username}`}
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
                            src={article.author.image}
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
                            to={`/profile/${article.author.username}`}
                            previewlistener="true"
                          >
                            {article.author.username}
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
                          className="heart-btn btn btn-sm btn-outline-primary pull-xs-right"
                          style={{
                            float: "right",
                            padding: ".25rem .5rem",
                            fontSize: ".875rem",
                            borderRadius: "0.2rem",
                            color: article.favorited ? "#fff" : "#5cb85c",
                            backgroundColor: article.favorited
                              ? "#5cb85c"
                              : "transparent",
                            borderColor: "#5cb85c",
                            display: "inline-block",
                            fontWeight: "400",
                            lineHeight: "1.25",
                            textAlign: "center",
                            cursor: "pointer",
                            userSelect: "none",
                            border: "1px solid #5cb85c",
                          }}
                          onClick={() =>
                            handleToggleFavorite(
                              article.slug,
                              article.favorited
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill={article.favorited ? "#fff" : "currentColor"}
                            className="bi bi-suit-heart-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                          </svg>{" "}
                          <span
                            className="favorites-count"
                            style={{
                              color: article.favorited
                                ? "#fff"
                                : "currentColor",
                            }}
                          >
                            {article.favoritesCount}
                          </span>
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
                  <div className="text-center">
                    No articles are here... yet.
                  </div>
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

export default Favorite;