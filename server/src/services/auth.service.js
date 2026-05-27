import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

const registerService = async (data) => {
  try {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashpassword = bcrypt.hashSync(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashpassword,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    return {
      accessToken,
      refreshToken,
      newUser,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const loginService = async (data) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await userModel.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashpassword = bcrypt.compareSync(password, userExists.password);

    if (!hashpassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);

    userExists.refreshToken = refreshToken;
    await userExists.save();

    return {
      accessToken,
      refreshToken,
      userExists,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getAccessTokenService = async (refreshToken) => {
  const decodedToken = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);

  if (!decodedToken) {
    throw new Error("Unauthorized");
  }

  const user = await userModel.findById(decodedToken.id);

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Unauthorized");
  }

  const accessToken = generateAccessToken(user._id);

  return accessToken;
};

export { registerService, loginService, getAccessTokenService };
