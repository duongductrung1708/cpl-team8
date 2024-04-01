import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow status

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
        setIsFollowing(data.article.author.following); // Set initial follow status
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
      // Perform follow/unfollow action here (API call)
      // Assuming there's an API endpoint to toggle follow status
      // This is just a mock implementation, you need to replace it with actual API calls
      // For demonstration purposes, we are toggling the follow status locally
      setIsFollowing((prevState) => !prevState);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="article-page">
      {article && !loading && (
        <div className="container">
          <div className="banner">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <img src={article.author.image} alt="author avatar" />
              <div className="info">
                <a
                  className="author"
                  href={`/profile/${article.author.username}`}
                >
                  {article.author.username}
                </a>
                <span className="date">{formatDate(article.createdAt)}</span>
              </div>
              <button
                className="btn btn-sm action-btn btn-outline-secondary"
                onClick={toggleFollow} 
              >
                <i className="ion-plus-round"></i>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                  />
                </svg>
                {isFollowing ? "Unfollow" : "Follow"} {article.author.username}
              </button>
              <button className="btn btn-sm btn-outline-primary">
                <i className="ion-heart"></i>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                  />
                </svg>{" "}
                Favorite Article
                <span className="counter">({article.favoritesCount})</span>
              </button>
            </div>
          </div>
          <div className="row article-content">
            <div className="col-xs-12">
              <p>{article.description}</p>
              <p>{article.body}</p>
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
            <div className="col-xs-12 col-md-8 offset-md-2">
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
      )}
    </div>
  );
};

export default ArticleDetail;