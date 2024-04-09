import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./css/styles.css";

const Footer = () => {

  return (
    <footer className="footer not-has-content">
      <Container>
        <Link
          className="logo-font"
          to={"/home"}
          previewlistener="true"
          style={{
            verticalAlign: "middle",
            color: "#5cb85c",
            textDecoration: "none",
            fontWeight: "700",
            backgroundColor: "transparent",
          }}
        >
          conduit
        </Link>
        <span
          className="attribution"
          style={{
            verticalAlign: "middle",
            marginLeft: "10px",
            fontSize: ".8rem",
            color: "#bbb",
            fontWeight: "300",
          }}
        >
          An interactive learning project from{" "}
          <Link
            className="thinkster"
            to={"https://thinkster.io"}
            previewlistener="true"
            style={{
              touchAction: "manipulation",
              color: "#5cb85c",
              textDecoration: "none",
              backgroundColor: "transparent",
            }}
          >
            Thinkster
          </Link>
          . Code &amp; design licensed under MIT.
        </span>
      </Container>
    </footer>
  );
};

export default Footer;
