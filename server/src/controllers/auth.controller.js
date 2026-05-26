import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

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

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresshToken", refreshToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json({ message: "User created successfully", user: newUser });
};

const loginController = async (req, res) => {};

export { registerController, loginController };
