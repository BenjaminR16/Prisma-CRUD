import { Router } from "express";
import { productViewController, productCreateController, productUpdateController, productRemoveController, productManyController } from "../controllers/productos.controller";
import multer from 'multer'

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("", productViewController);
router.post("/create", upload.single('file'), productCreateController);
router.post("/update", upload.single('file'), productUpdateController)
router.post("/remove", upload.single('file'), productRemoveController)
router.post("/many", upload.array('file'), productManyController)

export default router;