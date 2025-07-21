// backend/routes/orderRoutes.js
import express from "express";
import { createOrder, payOrder , getOrderById} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.patch('/:id/pay', payOrder);
// backend/routes/orderRoutes.js
router.get("/:id", getOrderById);


export default router;
