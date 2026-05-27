import express from "express";
import {
  getAccessTokenController,
  loginController,
  registerController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/get-accessToken", getAccessTokenController);

router.post("/register", registerController);
router.post("/login", loginController);

export default router;
