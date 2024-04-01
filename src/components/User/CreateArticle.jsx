import React, { useState } from "react";
import { Container } from "react-bootstrap";

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    articleTitle: "",
    description: "",
    body: "",
    tags: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://api.realworld.io/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          article: {
            title: formData.articleTitle,
            description: formData.description,
            body: formData.body,
            tagList: formData.tags.split(",").map((tag) => tag.trim()),
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create article");
      }
  
      const createdArticle = await response.json();
      console.log("Article created:", createdArticle);
  
      setFormData({
        articleTitle: "",
        description: "",
        body: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error creating article:", error);
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
                    value={formData.tags}
                    onChange={handleChange}
                    style={{
                      padding: ".75rem 1.5rem",
                      fontSize: "1.25rem",
                      borderRadius: ".3rem",
                    }}
                  />
                  <div className="tag-list"></div>
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
    </div>
  );
};

export default CreateArticle;
