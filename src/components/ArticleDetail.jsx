import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import Link
import "./css/articledetailstyle.css";
import Footer from "./Footer";
import { Container } from "react-bootstrap";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [isFavoritedLoading, setIsFavoritedLoading] = useState(false);

  useEffect(() => {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const toggleFollow = async () => {
    try {
      // Disable the button
      setIsFollowingLoading(true);

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
      // Enable the button again
      setIsFollowingLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      // Disable the button
      setIsFavoritedLoading(true);

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
      // Enable the button again
      setIsFavoritedLoading(false);
    }
  };

  return (
    <div className="article-page">
      {article && !loading && (
        <div>
          <div className="banner" style={{paddingRight:"120px", paddingLeft:"120px"}}>
            <Container>
              <h1>{article.title}</h1>
              <div className="article-meta">
                <img src={article.author.image} alt="author avatar" />
                <div className="info">
                  <Link
                    className="author"
                    to={`/profile/${article.author.username}`} // Use Link instead of href
                  >
                    {article.author.username}
                  </Link>
                  <span className="date">{formatDate(article.createdAt)}</span>
                </div>
                <button
                  className="btn btn-sm action-btn btn-outline-secondary"
                  onClick={toggleFollow}
                  disabled={isFollowingLoading}
                >
                  <i className="ion-plus-round"></i>{" "}
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
                  {isFollowing ? "Unfollow" : "Follow"} {article.author.username}
                </button>{" "}
                &nbsp;
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={toggleFavorite}
                  disabled={isFavoritedLoading}
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
                  <span className="counter">({article.favoritesCount})</span>
                </button>
              </div>
            </Container>
          </div>
          <div className="container page">
            <div className="row article-content">
              <div className="col-xs-12 than">
                <p style={{fontSize:"1.2rem", lineHeight:"1.8rem"}}>{article.description}</p>
                <div style={{fontSize:"1.2rem", lineHeight:"1.8rem"}}>
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
              <div className="than col-xs-12 col-md-8 offset-md-2">
                <form className="card comment-form">
                  <div className="card-block">
                    <textarea
                      name="comment"
                      className="form-control"
                      placeholder="Write a comment..."
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="card-footer">
                    <img
                      src="https://api.realworld.io/images/smiley-cyrus.jpeg"
                      className="comment-author-img"
                      alt="author avatar"
                    />
                    <button type="submit" className="btn btn-sm btn-primary">
                      Post Comment
                    </button>
                  </div>
                </form>
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
