import React from "react";
import API from "../api/API";

const ArticleList = ({ articleList, setArticleList }) => {
  const handleClickLikeBtn = (slug, isLiked) => {
    if (localStorage.getItem("auth-token")) {
      API.toggleLikeArticle(slug, isLiked).then((data) => {
        setArticleList((prevArticles) => {
          const index = prevArticles.articles.findIndex(
            (article) => article.slug === slug
          );
          const updatedArticles = [...prevArticles.articles];
          updatedArticles[index] = data.article;
          return {
            articles: updatedArticles,
            articlesCount: updatedArticles.length,
          };
        });
      });
    }
  };

  return (
    <div>
      {(!articleList && <div>Loading...</div>) ||
        (articleList.length === 0 && <div>There is no article yet</div>) ||
        (articleList.length > 0 &&
          articleList.map((a) => {
            return (
              <div key={a.slug}>
                <div className="article-preview">
                  <div className="article-meta d-flex justify-content-between">
                    <div className="d-flex gap-2 ">
                      <a
                        className="d-flex flex-column justify-content-center avatar"
                        href="/profile/Maksim Esteban"
                      >
                        <img
                          decoding="sync"
                          src={`${a.author.image}`}
                          alt="author avater"
                        />
                      </a>
                      <div className="info d-flex flex-column ">
                        <a className="author" href="/profile/Maksim Esteban">
                          {a.author.username}
                        </a>
                        <span className="date">January 4, 2024</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleClickLikeBtn(a.slug, a.favorited)}
                      className={`btn btn-sm btn${
                        a.favorited ? "" : "-outline"
                      }-primary pull-xs-right h-25`}
                    >
                      <i className="bi bi-suit-heart-fill"></i>{" "}
                      {a.favoritesCount}
                    </button>
                  </div>
                  <a
                    className="preview-link"
                    href="/article/Ill-quantify-the-redundant-TCP-bus-that-should-hard-drive-the-ADP-bandwidth!-553"
                  >
                    <h1>{a.title}</h1>
                    <p>{a.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {a.tagList.map((t, i) => {
                        return (
                          <li
                            key={i}
                            className="tag-default tag-pill tag-outline"
                          >
                            {t}
                          </li>
                        );
                      })}
                    </ul>
                  </a>
                </div>
              </div>
            );
          }))}
    </div>
  );
};

export default ArticleList;
