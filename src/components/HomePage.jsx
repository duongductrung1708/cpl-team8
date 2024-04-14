import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Footer from "./Footer";
import API from "../api/API.js";
import ArticleList from "./ArticleList.jsx";
import Sidebar from "./Sidebar.jsx";
import "./css/styles.css";

const HomePage = () => {
  const [articles, setArticles] = useState(null);
  const [tags, setTags] = useState(null);
  const [selectedTags, setSelectedTags] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currTag, setCurrTag] = useState(
    localStorage.getItem("auth-token") ? "yourfeed" : "globalfeed"
  );
  const [isOverFlow, setIsOverFlow] = useState(false);

  useEffect(() => {
    fetchData(currentPage, currTag);

    API.getTags().then((data) => {
      setTags(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [articles, isOverFlow]);

  const fetchData = (page, currTag, tag) => {
    if (currTag === "yourfeed") {
      API.getArticlesOfFollowed(
        page,
        10,
        localStorage.getItem("auth-token")
      ).then((data) => {
        setArticles(data.articles);
        setTotalPages(Math.ceil(data.articlesCount / 10));
      });
    } else if (currTag === "globalfeed") {
      API.getArticles(page, 10, localStorage.getItem("auth-token")).then(
        (data) => {
          setArticles(data.articles);
          setTotalPages(Math.ceil(data.articlesCount / 10));
        }
      );
    } else if (currTag === "filterfeed") {
      API.getArticlesByTag(
        page,
        10,
        localStorage.getItem("auth-token"),
        tag ? tag : selectedTags
      ).then((data) => {
        console.log(data);
        setArticles(data.articles);
        setTotalPages(Math.ceil(data.articlesCount / 10));
      });
    }
  };

  const handleClickYourFeedTag = () => {
    setCurrTag("yourfeed");
    setArticles(null);
    fetchData(1, "yourfeed");
    setTotalPages(0)
  };

  const handleClickGlobalFeedTag = () => {
    setCurrTag("globalfeed");
    setArticles(null);
    fetchData(1, "globalfeed");
    setTotalPages(0)
  };

  const handleClickFilterFeedTag = () => {
    setCurrTag("filterfeed");
    setArticles(null);
    fetchData(1, "filterfeed");
    setTotalPages(0)
  };

  const handleTagClick = (tag) => {
    setSelectedTags(tag);
    fetchData(1, "filterfeed", tag);
    setCurrTag("filterfeed");
    setCurrentPage(1);
    setTotalPages(0)
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, currTag);
  };

  return (
    <div>
      {!localStorage.getItem("auth-token") && (
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
              style={{
                fontSize: "1.5rem",
                fontWeight: "300",
                marginBottom: "0",
              }}
            >
              A place to share your knowledge.
            </p>
          </Container>
        </div>
      )}
      <Container style={{marginTop: "2rem"}}>
        <div className="row">
          <div className="col-md-9">
            <div className="border-bottom">
              <ul className="nav">
                {localStorage.getItem("auth-token") && (
                  <li
                    onClick={handleClickYourFeedTag}
                    className={`nav-item py-2 px-3 ${
                      currTag === "yourfeed" && "active"
                    }`}
                  >
                    Your Feed
                  </li>
                )}
                <li
                  onClick={handleClickGlobalFeedTag}
                  className={`nav-item py-2 px-3 ${
                    currTag === "globalfeed" && "active"
                  }`}
                >
                  Global Feed
                </li>
                {selectedTags && (
                  <li
                    onClick={handleClickFilterFeedTag}
                    className={`nav-item py-2 px-3 ${
                      currTag === "filterfeed" && "active"
                    }`}
                  >
                    #{selectedTags}
                  </li>
                )}
              </ul>
            </div>
            <ArticleList
              articleList={articles}
              setArticleList={setArticles}
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
                  <div
                    style={{ float: "left", cursor: "pointer" }}
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </div>
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
