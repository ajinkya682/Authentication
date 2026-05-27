import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(accessToken, config.JWT_ACCESS_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    throw new Error(error);
  }
};

export default authMiddleware;
