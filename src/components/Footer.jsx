import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
      <footer
        className="footer"
        style={{
          background: "#f3f3f3",
          marginTop: "3rem",
          padding: "1rem 0",
          position: "absolute",
          bottom: "0",
          width: "100%",
        }}
      >
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
