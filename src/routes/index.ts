import express, { Router } from "express";
import authRoutes from "./auth.routes";
import groceryRoutes from "./grocery.routes";
import orderRoutes from "./order.routes";

const router: Router = express.Router();

/**
 * @route   /api/auth
 * @desc    Authentication-related routes
 */
router.use("/api/auth", authRoutes);

/**
 * @route   /api/grocery
 * @desc    Grocery item-related routes
 */
router.use("/api/grocery", groceryRoutes);

/**
 * @route   /api/order
 * @desc    Order-related routes
 */
router.use("/api/order", orderRoutes);

export default router;
