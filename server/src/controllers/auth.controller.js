import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { registerService } from "../services/auth.service.js";

export const registerController = async (req, res) => {
  const { accessToken, refreshToken, newUser } = await registerService(
    req.body,
  );

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

export const loginController = async (req, res) => {};
