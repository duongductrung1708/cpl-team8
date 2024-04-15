import React, { useState } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Footer from "../Footer";
import { useNavigate, useLocation } from "react-router-dom";
import AuthenticationCheck from "./AuthenticationCheck";
import ClearIcon from "@mui/icons-material/Clear";
import "../css/styles.css";

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

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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
  
  if (!formData.articleTitle || !formData.description || !formData.body || tags.length === 0) {
    alert("Please fill in all required fields.");
    return;
  }

  setConfirmDialogOpen(true);
};

  const handleConfirmPublish = async () => {
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
                        className="tag-create tag-default tag pill"
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
                          <ClearIcon fontSize="small" style={{ marginBottom: "2px" }} />
                        </i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  style={{ float: "right" }}
                >
                  Publish Article
                </Button>
              </fieldset>
            </form>
          </div>
        </div>
      </Container>
      <Footer />
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Publish</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to publish this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmPublish} autoFocus>
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AuthenticationCheck(CreateArticle);
