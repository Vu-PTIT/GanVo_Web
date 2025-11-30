import express from "express";
import { authMe, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/", getUsers);

export default router;
