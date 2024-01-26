import { indexEdition } from "../controllers/editionController";
import express from "express"
const router = express.Router()
import upload from "../config/multer"

router.post("/edition", upload.single("edition") ,indexEdition)

export default router;