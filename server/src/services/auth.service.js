import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
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

    return {
      accessToken,
      refreshToken,
      userExists,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export { registerService, loginService };
