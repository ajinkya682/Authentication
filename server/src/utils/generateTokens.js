import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
};

export { generateAccessToken, generateRefreshToken };
