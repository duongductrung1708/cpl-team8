import axios from "axios";

const API = {};
const BASE_URL = "https://api.realworld.io/api";

API.getArticles = async () => {
  try {
    const res = await axios.get(BASE_URL + "/articles");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

API.getArticlesByUsername = async (username) => {
  try {
    const res = await axios.get(BASE_URL + `/articles/?author=${username}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

API.getFavoriteArticlesByUsername = async (username) => {
  try {
    const res = await axios.get(BASE_URL + `/articles/?favorited=${username}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

API.getFollowArticlesByUsername = async (username) => {
  try {
    const res = await axios.get(BASE_URL + `/articles/?favorited=${username}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};




export default API;
