import sendEmail from "../controllers/mailController.js";
import { Router } from "express";

const router = Router();

router.post("/send-mail", sendEmail);

export default router;