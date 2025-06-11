import axios from "axios";

const get = async (url) => {
  const token = localStorage.getItem("actkn"); // Make sure this matches your localStorage key

  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
      Authorization: `Bearer ${token}` // ✅ Add JWT token here
    }
  });

  return response.data;
};

export default { get };
