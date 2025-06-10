import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    }

    return false;
  } catch (err) {
    console.log("❌ Token decode failed:", err.message);
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) return responseHandler.unauthorize(res);

  // 👇 Fix here (use 'id' instead of 'data' if that's how you encoded)
  const user = await userModel.findById(tokenDecoded.id);

  if (!user) return responseHandler.unauthorize(res);

  req.user = user;

  next();
};

export default { auth, tokenDecode };
