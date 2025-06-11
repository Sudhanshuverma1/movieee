import axios from "axios";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const TMDB_KEY = process.env.TMDB_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const fullUrl = `${TMDB_BASE_URL}/${mediaType}/${mediaCategory}`;
    console.log("📡 Hitting TMDB URL:", fullUrl);

    const response = await axios.get(fullUrl, {
      params: {
        api_key: TMDB_KEY,
        page
      }
    });

    return responseHandler.ok(res, response.data);
  } catch (err) {
    console.error("🔥 FULL ERROR:", err); // full object
    console.error("🔥 RESPONSE:", err.response?.data);
    console.error("🔥 MESSAGE:", err.message);
    responseHandler.error(res);
  }
};


const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await axios.get(`${TMDB_BASE_URL}/genre/${mediaType}/list`, {
      params: {
        api_key: TMDB_KEY
      }
    });

    return responseHandler.ok(res, response.data);
  } catch (err) {
    console.error("🔥 [getGenres] TMDB API Error:", err.response?.data || err.message);
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/search/${mediaType === "people" ? "person" : mediaType}`, {
      params: {
        api_key: TMDB_KEY,
        query,
        page
      }
    });

    responseHandler.ok(res, response.data);
  } catch (err) {
    console.error("🔥 [search] TMDB API Error:", err.response?.data || err.message);
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;
    const params = { mediaType, mediaId };

    const mediaRes = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${mediaId}`, {
      params: { api_key: TMDB_KEY }
    });

    const creditsRes = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${mediaId}/credits`, {
      params: { api_key: TMDB_KEY }
    });

    const videosRes = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${mediaId}/videos`, {
      params: { api_key: TMDB_KEY }
    });

    const recommendRes = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${mediaId}/recommendations`, {
      params: { api_key: TMDB_KEY }
    });

    const imagesRes = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${mediaId}/images`, {
      params: { api_key: TMDB_KEY }
    });

    const media = {
      ...mediaRes.data,
      credits: creditsRes.data,
      videos: videosRes.data,
      recommend: recommendRes.data.results,
      images: imagesRes.data
    };

    const tokenDecoded = tokenMiddleware.tokenDecode(req);
    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.id); // ✅ use .id, not .data
      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId });
        media.isFavorite = isFavorite !== null;
      }
    }

    media.reviews = await reviewModel.find({ mediaId }).populate("user").sort("-createdAt");

    responseHandler.ok(res, media);
  } catch (err) {
    console.error("🔥 [getDetail] TMDB or DB Error:", err.response?.data || err.message);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };
