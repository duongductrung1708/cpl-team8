import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Footer from "./Footer";
import API from "../api/API.js";
import ArticleList from "./ArticleList.jsx";
import Sidebar from "./Sidebar.jsx";

const HomePage = () => {
  const [articlesGlobal, setArticleGlobal] = useState(null);
  const [tags, setTags] = useState(null);
  const [selectedTags, setSelectedTags] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
    API.getTags().then((data) => {
      setTags(data);
    });
  }, []);

  const fetchData = (page) => {
    API.getArticles(page, 10, localStorage.getItem("auth-token")).then(
      (data) => {
        setArticleGlobal(data);
        setTotalPages(Math.ceil(data.articlesCount / 10));
      }
    );
  };

  const handleTagClick = (tag) => {
    setSelectedTags(tag);
    setCurrentPage(1); 
    fetchData(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  return (
    <div>
      <div
        className="banner text-white"
        style={{
          display: "inherit",
          background: "#5CB85C",
          boxShadow:
            "inset 0 8px 8px -8px rgba(0, 0, 0, 0.3), inset 0 -8px 8px -8px rgba(0, 0, 0, 0.3)",
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >
        <Container>
          <h1
            className="logo-font text-white text-center"
            style={{
              textShadow: "0px 1px 3px rgba(0, 0, 0, 0.3)",
              fontSize: "3.5rem",
              paddingBottom: "0.5rem",
              fontWeight: "700",
              marginBottom: "0",
            }}
          >
            conduit
          </h1>
          <p
            className="text-secondary text-white text-center"
            style={{ fontSize: "1.5rem", fontWeight: "300", marginBottom: "0" }}
          >
            A place to share your knowledge.
          </p>
        </Container>
      </div>
      <Container>
        <div className="row">
          <div className="col-md-9">
            <div className="border-bottom">
              <ul className="nav">
                <li
                  className={`nav-item py-2 px-3 ${
                    selectedTags ? "" : "active"
                  }`}
                  style={{ color: selectedTags ? "#aaa" : "rgb(92, 184, 92)" }}
                >
                  Global Feed
                </li>
                {selectedTags && (
                  <li
                    className="nav-item py-2 px-3 active"
                    style={{ color: "rgb(92, 184, 92)" }}
                  >
                    #{selectedTags}
                  </li>
                )}
              </ul>
            </div>
            <ArticleList
              articleList={articlesGlobal && articlesGlobal.articles}
              setArticleList={setArticleGlobal}
              selectedTags={selectedTags}
            />
          </div>

          <div className="col-md-3">
            <Sidebar tagList={tags} handleTagClick={handleTagClick} />
          </div>
        </div>
        <div>
          <nav>
            <ul className="pagination" style={{ marginBottom: "100px" }}>
              {[...Array(totalPages).keys()].map((page) => (
                <li
                  className={`page-item ${
                    page + 1 === currentPage ? "active" : ""
                  }`}
                  key={page}
                >
                  <a
                    style={{ float: "left", cursor: "pointer" }}
                    className="page-link"
                    href="true"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default HomePage;
