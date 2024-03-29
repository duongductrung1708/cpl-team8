import React, { useEffect } from "react";
import API from "../api/API";

const Header = () => {
  useEffect(() => {
    API.getArticles().then((data) => console.log(data));
  });
  return <></>;
};

export default Header;
