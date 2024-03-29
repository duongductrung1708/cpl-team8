import React from "react";
import { Container } from "react-bootstrap";

const HomePage = () => {
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
    </div>
  );
};

export default HomePage;
