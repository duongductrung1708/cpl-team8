import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./css/articledetailstyle.css";
import Footer from "./Footer";
import { Container } from "react-bootstrap";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [isFavoritedLoading, setIsFavoritedLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [isAuthor, setIsAuthor] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsLoggedIn(!!token);

    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://api.realworld.io/api/articles/${slug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article);
        setIsFollowing(data.article.author.following);
        setIsFavorited(data.article.favorited);
        setIsAuthor(
          data.article.author.username === localStorage.getItem("auth-username")
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    const fetchUserProfileImage = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (token) {
          const response = await fetch("https://api.realworld.io/api/user", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          const userData = await response.json();
          setUserProfileImage(userData.user.image);
        }
      } catch (error) {
        console.error("Error fetching user profile image:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const cachedComments = JSON.parse(
          localStorage.getItem(`comments_${slug}`)
        );
        if (cachedComments) {
          setComments(cachedComments);
        } else {
          const response = await fetch(
            `https://api.realworld.io/api/articles/${slug}/comments`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch comments");
          }
          const data = await response.json();
          setComments(data.comments);
          updateCommentsInStorage(slug, data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchUserProfileImage();
    fetchArticle();
    fetchComments();
  }, [slug]);

  const handleEditArticle = () => {
    navigate(`/editor/${slug}`, { state: { article } });
  };

  const handleDeleteArticle = async () => {
    try {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("auth-token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      navigate("/home");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const toggleFollow = async () => {
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }

    try {
      setIsFollowingLoading(true);
      const followButton = document.querySelector(".btn-outline-secondary");

      followButton.classList.toggle("active");

      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch(
        `https://api.realworld.io/api/profiles/${article.author.username}/follow`,
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

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }

    try {
      setIsFavoritedLoading(true);
      const favoriteButton = document.querySelector(".favo-btn");

      favoriteButton.classList.toggle("active");

      const method = isFavorited ? "DELETE" : "POST";
      const response = await fetch(
        `https://api.realworld.io/api/articles/${article.slug}/favorite`,
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
      setArticle(favoritedArticle.article);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    } finally {
      setIsFavoritedLoading(false);
    }
  };

  const updateCommentsInStorage = (slug, comments) => {
    localStorage.setItem(`comments_${slug}`, JSON.stringify(comments));
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }

    if (!commentText.trim() || postingComment) return;

    try {
      setPostingComment(true);
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("auth-token")}`,
          },
          body: JSON.stringify({ comment: { body: commentText } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const newComment = await response.json();
      const updatedComments = [newComment.comment, ...comments];
      setComments(updatedComments);
      setCommentText("");

      updateCommentsInStorage(slug, updatedComments);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("auth-token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);

      updateCommentsInStorage(slug, updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="article-page">
      {article && !loading && (
        <div>
          <div className="banner">
            <Container>
              <h1>{article.title}</h1>
              <div className="article-meta">
                <img src={article.author.image} alt="author avatar" />
                <div className="info">
                  <Link
                    className="author"
                    to={`/profile/${article.author.username}`}
                  >
                    {article.author.username}
                  </Link>
                  <span className="date">{formatDate(article.createdAt)}</span>
                </div>
                {isLoggedIn && isAuthor ? (
                  <>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleEditArticle}
                    >
                      <i className="ion-edit"></i>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-fill"
                        viewBox="0 0 16 16"
                        style={{ marginRight: "3px" }}
                      >
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                      </svg>
                      Edit Article
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteArticle}
                    >
                      <i className="ion-trash-a"></i>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                      </svg>
                      Delete Article
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm action-btn btn-outline-secondary"
                      onClick={toggleFollow}
                      disabled={!isLoggedIn || isFollowingLoading}
                    >
                      <i className="ion-plus-round"></i>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-plus-lg"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                        />
                      </svg>
                      {isFollowing ? "Unfollow" : "Follow"}{" "}
                      {article.author.username}
                    </button>{" "}
                    &nbsp;
                    <button
                      className="btn btn-sm favo-btn"
                      onClick={toggleFavorite}
                      disabled={!isLoggedIn || isFavoritedLoading}
                    >
                      <i className="ion-heart"></i>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-heart-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                        />
                      </svg>{" "}
                      {isFavorited ? "Unfavorite Article" : "Favorite Article"}
                      <span className="counter">
                        ({article.favoritesCount})
                      </span>
                    </button>
                  </>
                )}
              </div>
            </Container>
          </div>
          <div className="container page">
            <div className="row article-content">
              <div className="col-xs-12 than">
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8rem" }}>
                  {article.description}
                </p>
                <div style={{ fontSize: "1.2rem", lineHeight: "1.8rem" }}>
                  <p>{article.body}</p>
                </div>
                <ul className="tag-list">
                  {article.tagList.map((tag) => (
                    <li className="tag-default tag-pill tag-outline" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <hr />
            <div className="row">
              <div
                className="than col-xs-12 col-md-8 offset-md-2"
                style={{ marginBottom: "100px" }}
              >
                {isLoggedIn ? (
                  <form
                    className="card comment-form"
                    onSubmit={handlePostComment}
                  >
                    <div className="card-block">
                      <textarea
                        name="comment"
                        className="form-control"
                        placeholder="Write a comment..."
                        rows="3"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="card-footer">
                      <img
                        src={userProfileImage}
                        className="comment-author-img"
                        alt="author avatar"
                      />
                      <button type="submit" className="btn btn-sm btn-primary">
                        Post Comment
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div>
                      <p className="signinup">
                        <Link to="/signin">Sign in</Link> or{" "}
                        <Link to="/signup">Sign up</Link> to add comments on
                        this article.
                      </p>
                    </div>
                  </div>
                )}
                {comments.map((comment) => (
                  <div className="card" key={comment.id}>
                    <div className="card-block">
                      <p className="card-text">{comment.body}</p>
                    </div>
                    <div className="card-footer">
                      <Link
                        className="comment-author"
                        to={`/profile/${comment.author.username}`}
                      >
                        <img
                          src={comment.author.image}
                          className="comment-author-img"
                          alt="author avatar"
                        />
                      </Link>
                      &nbsp;
                      <Link
                        className="comment-author"
                        to={`/profile/${comment.author.username}`}
                      >
                        {comment.author.username}
                      </Link>
                      <span className="date-posted">
                        {formatDate(comment.createdAt)}
                      </span>
                      <span
                        className="mod-options"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ArticleDetail;
