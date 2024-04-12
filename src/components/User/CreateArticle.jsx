import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Footer from "../Footer";
import { useNavigate, useLocation } from "react-router-dom";
import AuthenticationCheck from "./AuthenticationCheck";

const CreateArticle = () => {
  const nav = useNavigate();
  const location = useLocation();
  const existingArticle = location.state?.article;

  const [formData, setFormData] = useState({
    articleTitle: existingArticle?.title || "",
    description: existingArticle?.description || "",
    body: existingArticle?.body || "",
  });

  const [tags, setTags] = useState(existingArticle?.tagList || []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    const newTags = e.target.value.split(",").map((tag) => tag.trim());
    setTags(newTags);
  };  

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = existingArticle ? "PUT" : "POST";
      const url = existingArticle
        ? `https://api.realworld.io/api/articles/${existingArticle.slug}`
        : "https://api.realworld.io/api/articles";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          article: {
            title: formData.articleTitle,
            description: formData.description,
            body: formData.body,
            tagList: tags,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create/update article");
      }

      const updatedArticle = await response.json();
      console.log("Article updated:", updatedArticle);
      nav(`/article/${updatedArticle.article.slug}`);

      setFormData({
        articleTitle: "",
        description: "",
        body: "",
      });
      setTags([]);
    } catch (error) {
      console.error("Error creating/updating article:", error);
    }
  };

  return (
    <div className="editor-page">
      <Container style={{ marginTop: "1.5rem" }}>
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset
                  className="form-group"
                  style={{ marginBottom: "1rem" }}
                >
                  <input
                    type="text"
                    name="articleTitle"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={formData.articleTitle}
                    onChange={handleChange}
                    style={{
                      padding: ".75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: ".3rem",
                    }}
                  />
                </fieldset>
                <fieldset
                  className="form-group"
                  style={{ marginBottom: "1rem" }}
                >
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={formData.description}
                    onChange={handleChange}
                    style={{
                      padding: ".75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: ".3rem",
                    }}
                  />
                </fieldset>
                <fieldset
                  className="form-group"
                  style={{ marginBottom: "1rem" }}
                >
                  <textarea
                    className="form-control"
                    name="body"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={formData.body}
                    onChange={handleChange}
                    style={{
                      padding: ".75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: ".3rem",
                    }}
                  ></textarea>
                </fieldset>
                <fieldset
                  className="form-group"
                  style={{ marginBottom: "1rem" }}
                >
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tags.join(", ")}
                    onChange={handleTagChange}
                    style={{
                      padding: ".75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: ".3rem",
                    }}
                  />
                  <div className="tag-list">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-default tag pill"
                        style={{
                          color: "#fff !important",
                          fontSize: ".8rem",
                          paddingTop: ".1rem",
                          paddingBottom: ".1rem",
                          whiteSpace: "nowrap",
                          marginRight: "3px",
                          marginTop: "3px",
                          marginBottom: ".2rem",
                          display: "inline-block",
                          backgroundColor: "#818a91",
                          paddingRight: ".6em",
                          paddingLeft: ".6em",
                          borderRadius: "10rem",
                        }}
                      >
                        <i
                          className="ion-close-round"
                          style={{
                            fontSize: ".6rem",
                            marginRight: "3px",
                            cursor: "pointer",
                            fontStyle: "italic",
                          }}
                          onClick={() => removeTag(tag)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-x"
                            viewBox="0 0 16 16"
                            style={{marginBottom:"2px"}}
                          >
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                          </svg>
                        </i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  style={{
                    float: "right",
                    padding: ".75rem 1.5rem",
                    fontSize: "1.25rem",
                    borderRadius: ".3rem",
                    backgroundColor: "#5cb85c",
                    borderColor: "#5cb85c",
                    display: "inline-block",
                    fontWeight: "400",
                    lineHeight: "1.25",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    verticalAlign: "middle",
                    cursor: "pointer",
                    userSelect: "none",
                    border: "1px solid transparent",
                  }}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default AuthenticationCheck(CreateArticle);
