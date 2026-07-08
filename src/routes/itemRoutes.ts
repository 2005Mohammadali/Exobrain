import { Router } from "express";
import { addLinkItem, addQuickItem } from "../controllers/itemController.js";

const router = Router();

router.post("/quick-add", addQuickItem);
router.post("/save-link", addLinkItem);

export default router;