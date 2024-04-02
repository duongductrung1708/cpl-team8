import React from "react";

const ArticleList = ({ articleList,selectedTags }) => {
  return (
    <div>
            <div className="border-bottom">
            <ul className="nav">
            <li className={`nav-item py-2 px-3 ${selectedTags ? "" : "active"}`} style={{ color: selectedTags ? "#aaa" : "rgb(92, 184, 92)" }}>
            Global Feed
          </li>
          {selectedTags && (
            <li className="nav-item py-2 px-3 active" style={{ color: "rgb(92, 184, 92)" }}>
              #{selectedTags}
            </li>
          )}
        </ul>
        </div>
      {(!articleList && <div>Loading...</div>) ||
        (articleList.articles.length === 0 && (
          <div>There is no article yet</div>
        )) ||
        (articleList.articles.length > 0 &&
          articleList.articles.map((a) => {
            return (
              <div key={a.slug}>
                <div className="article-preview">
                  <div className="article-meta d-flex justify-content-between">
                    <div className="d-flex gap-2 ">
                      <a
                        className="d-flex flex-column justify-content-center"
                        href="/profile/Maksim Esteban"
                      >
                        <img
                          decoding="sync"
                          src={`${a.author.image}`}
                          alt="author avater"
                        />
                      </a>
                      <div className="info d-flex flex-column">
                        <a className="author" href="/profile/Maksim Esteban">
                          {a.author.username}
                        </a>
                        <span className="date">January 4, 2024</span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary pull-xs-right h-25">
                      <i class="bi bi-suit-heart-fill"></i> {a.favoritesCount}
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
