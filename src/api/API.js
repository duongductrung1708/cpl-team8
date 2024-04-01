import axios from "axios";

const API = {};
const BASE_URL = "https://api.realworld.io/api";

API.getArticles = async (page, limit) => {
  try {
    const res = await axios.get(BASE_URL + `/articles?offset=${(page-1) * limit}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default API;
