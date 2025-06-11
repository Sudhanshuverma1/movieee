const baseUrl = process.env.TMDB_BASE_URL; // should be https://api.themoviedb.org/3 (no trailing slash)
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return `${baseUrl}/${endpoint}?api_key=${key}${qs ? `&${qs}` : ''}`;
};

export default { getUrl };
