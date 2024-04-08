import React, {  } from "react";
import API from "../api/API";
import { useNavigate } from "react-router-dom";

const ArticleList = ({ articleList, setArticleList }) => {
  const nav = useNavigate();

  const handleClickLikeBtn = (e, slug, isLiked) => {
    if (localStorage.getItem("auth-token")) {
      e.target.parentElement.classList.add("disabled");
      API.toggleLikeArticle(slug, isLiked).then((data) => {
        setArticleList((prevArticles) => {
          const index = prevArticles.findIndex(
            (article) => article.slug === slug
          );
          const updatedArticles = [...prevArticles];
          updatedArticles[index] = data.article;
          return updatedArticles;
        });
        e.target.parentElement.classList.remove("disabled");
      });
    } else {
      nav("/signup");
    }
  };

  return (
    <div>
      {(!articleList && <div style={{textAlign: 'center'}}>Loading Acticle...</div>) ||
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
                        href={`/profile/${a.author.username}`}
                      >
                        <img
                          decoding="sync"
                          src={`${a.author.image}`}
                          alt="author avater"
                        />
                      </a>
                      <div className="info d-flex flex-column ">
                        <a
                          className="author"
                          href={`/profile/${a.author.username}`}
                        >
                          {a.author.username}
                        </a>
                        <span className="date">January 4, 2024</span>
                      </div>
                    </div>
                    <div className={`h-25 like-btn__container`}>
                      <button
                        onClick={(e) =>
                          handleClickLikeBtn(e, a.slug, a.favorited)
                        }
                        className={`btn btn-sm btn${
                          a.favorited ? "" : "-outline"
                        }-primary pull-xs-right h-100 w-100 like-btn `}
                      >
                        <i className="bi bi-suit-heart-fill"></i>{" "}
                        {a.favoritesCount}
                      </button>
                    </div>
                  </div>
                  <a className="preview-link" href={`/article/${a.slug}`}>
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
