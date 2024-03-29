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

export default API;
