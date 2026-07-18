import { Router } from "express";
import { addLinkItem, addQuickItem, getItems } from "../controllers/itemController.js";

const router = Router();

router.post("/quick-add", addQuickItem);
router.post("/save-link", addLinkItem);
router.get("/", getItems);

export default router;