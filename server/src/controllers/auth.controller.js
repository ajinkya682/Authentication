import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import {
  registerService,
  loginService,
  getAccessTokenService,
} from "../services/auth.service.js";

const registerController = async (req, res) => {
  const { accessToken, refreshToken, newUser } = await registerService(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json({ message: "User created successfully", user: newUser });
};

const loginController = async (req, res) => {
  const { accessToken, refreshToken, userExists } = await loginService(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json({ message: "User Logged in successfully", user: userExists });
};

const getAccessTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = await getAccessTokenService(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 15 * 60 * 1000,
  });

  return res
    .status(200)
    .json({ message: "Access token generated successfully" });
};

export { registerController, loginController, getAccessTokenController };
