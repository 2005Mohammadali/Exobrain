import { Router } from "express";
import { addLinkItem, addQuickItem, archieveItem, deleteItem, getItems, updateItem } from "../controllers/itemController.js";

const router = Router();

router.post("/quick-add", addQuickItem);
router.post("/save-link", addLinkItem);
router.get("/", getItems);
router.put("/:id/archive", archieveItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;