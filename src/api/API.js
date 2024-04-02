import axios from "axios";

const API = {};
const BASE_URL = "https://api.realworld.io/api";

API.getArticles = async (page, limit, token) => {
  try {
    const config = {
      headers: {
        Authorization: `${token ? `Token ${token}` : ""}`,
      },
    };
    const res = await axios.get(
      BASE_URL + `/articles?offset=${(page - 1) * limit}&limit=${limit}`,
      config
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};


API.getTags = async () => {
  try {
    const res = await axios.get(BASE_URL + `/tags`);
    return res.data;
      } catch (error) {
    console.log(error);
  }
};

API.toggleLikeArticle = async (slug, isLiked) => {
  try {
    if (localStorage.getItem("auth-token")) {
      const config = {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth-token")}`,
        },
      };
      const res = await axios(BASE_URL + `/articles/${slug}/favorite`, config);
      return res.data;
    }} catch (error) {
      console.log(error);
    }
  };

export default API;
