import express from "express";
import { ManualScreeningController } from "../controllers/manual-screening.controller";

const router = express.Router();

router.post(
  "/chat/:protocol_id",
  ManualScreeningController.handleManualScreeningChat
);

router.get(
  "/history/",
  ManualScreeningController.getConversationHistory
);

export default router;
