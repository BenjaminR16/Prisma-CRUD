import { Router } from "express";
import { productViewController, productCreateController } from "../controllers/productos.controller";
import multer from 'multer'

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("", productViewController);
router.post("/create", upload.single('file'), productCreateController);

export default router;