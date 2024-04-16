import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../css/styles.css";
import UserBanner from "./UserBanner";
import Footer from "../Footer";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import FavoriteIcon from "@mui/icons-material/Favorite";

const PAGE_SIZE = 5;

const getUserProfileByUsername = async (username) => {
  try {
    const response = await fetch(
      `https://api.realworld.io/api/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: localStorage.getItem("auth-token")
            ? `Token ${localStorage.getItem("auth-token")}`
            : "",
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

const getUserArticlesByUsername = async (username, offset) => {
  try {
    const response = await fetch(
      `https://api.realworld.io/api/articles?limit=${PAGE_SIZE}&offset=${offset}&author=${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: localStorage.getItem("auth-token")
            ? `Token ${localStorage.getItem("auth-token")}`
            : "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user articles");
    }

    const { articles, articlesCount } = await response.json();
    return { articles, articlesCount };
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

const UserProfile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userArticles, setUserArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticlesCount, setTotalArticlesCount] = useState(0);
  const nav = useNavigate();

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
        const offset = (currentPage - 1) * PAGE_SIZE;
        const { articles, articlesCount } = await getUserArticlesByUsername(
          username,
          offset
        );
        const updatedArticles = articles.map((article) => ({
          ...article,
          favorited: true,
        }));
        setUserArticles(updatedArticles);
        setTotalArticlesCount(articlesCount);
        const totalPagesCount = Math.ceil(articlesCount / PAGE_SIZE);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error("Error fetching user articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
    fetchProfile();
  }, [username, currentPage]);

  const [isOverFlow, setIsOverFlow] = useState(false);
  useEffect(() => {
    if (isOverFlow) {
      document.querySelector(".footer").classList.remove("not-has-content");
    } else {
      if (
        !document.querySelector(".footer").classList.contains("not-has-content")
      ) {
        document.querySelector(".footer").classList.add("not-has-content");
      }
    }
    setIsOverFlow(document.documentElement.scrollHeight > window.innerHeight);
  }, [userArticles, userProfile, isOverFlow]);

  const handleToggleFavorite = async (slug, isFavorited) => {
    try {
      if (!localStorage.getItem("auth-token")) {
        nav("/signup");
        return;
      }
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

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="profile-page">
      <UserBanner />
      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        userProfile && (
          <>
            <Container style={{ marginBottom: "50px" }}>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  {(userArticles.length === 0 && (
                    <div>There is no article yet</div>
                  )) ||
                    (userArticles.length > 0 &&
                      userArticles.map((article) => {
                        return (
                          <div key={article.slug} className="article-preview">
                            <div className="article-meta">
                              <Link
                                className="link-img"
                                to={`/profile/${username}`}
                                previewlistener="true"
                              >
                                <img
                                  className="author-avt"
                                  decoding="sync"
                                  src={userProfile.image}
                                  alt="author avater"
                                />
                              </Link>
                              <div className="info">
                                <Link
                                  className="author"
                                  to={`/profile/${username}`}
                                  previewlistener="true"
                                >
                                  {userProfile.username}
                                </Link>
                                <span className="date">
                                  {new Date(article.createdAt).toDateString()}
                                </span>
                              </div>
                              <button
                                className="heart-btn btn btn-sm btn-outline-primary pull-xs-right"
                                style={{
                                  color: article.favorited ? "#fff" : "#5cb85c",
                                  backgroundColor: article.favorited
                                    ? "#5cb85c"
                                    : "transparent",
                                }}
                                onClick={() =>
                                  handleToggleFavorite(
                                    article.slug,
                                    article.favorited
                                  )
                                }
                              >
                                <FavoriteIcon
                                  sx={{
                                    fill: article.favorited
                                      ? "#fff"
                                      : "currentColor",
                                    width: 16,
                                    height: 16,
                                  }}
                                />{" "}
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
                            >
                              <h1 className="h1-userprofile">
                                {article.title}
                              </h1>
                              <p className="p-userprofile">
                                {article.description}
                              </p>
                              <span className="span-userprofile">
                                Read more...
                              </span>
                              <ul className="tag-list">
                                {article.tagList.map((tag) => (
                                  <li
                                    key={tag}
                                    className="tag-default tag-pill tag-outline"
                                  >
                                    {tag}
                                  </li>
                                ))}
                              </ul>
                            </Link>
                          </div>
                        );
                      }))}
                </div>
              </div>
              {userArticles.length > 0 && (
                <div className="pagination-container d-flex justify-content-center mt-4">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                </div>
              )}
            </Container>
          </>
        )
      )}
      <Footer />
    </div>
  );
};

export default UserProfile;
