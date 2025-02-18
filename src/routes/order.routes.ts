import express, { Router } from "express";
import { placeOrder } from "../controllers/order.controller";
import { authentication } from "../middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @route   POST /api/order/orders
 * @desc    Place a new order
 * @access  Private (Authenticated Users)
 */
router.post("/orders", authentication, placeOrder);

export default router;
