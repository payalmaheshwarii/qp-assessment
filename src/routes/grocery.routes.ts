import express, { Router } from "express";
import {
    addGroceryItem,
    getGroceryItems,
    updateGroceryItem,
    deleteGroceryItem
} from "../controllers/grocery.controller";
import { authentication, authorizeRoles } from "../middleware/authMiddleware";
import { UserRole } from "../models/User";

const groceryRouter: Router = express.Router();

/**
 * @route   POST /api/grocery-items
 * @desc    Add a new grocery item (Admin only)
 * @access  Private (Admin)
 */
groceryRouter.post("/grocery-items", authentication, authorizeRoles([UserRole.ADMIN]), addGroceryItem);

/**
 * @route   GET /api/grocery-items
 * @desc    View all grocery items (Admin & User)
 * @access  Private (Admin, User)
 */
groceryRouter.get("/grocery-items", authentication, authorizeRoles([UserRole.ADMIN, UserRole.USER]), getGroceryItems);

/**
 * @route   PUT /api/grocery-items/:id
 * @desc    Update a grocery item (Admin only)
 * @access  Private (Admin)
 */
groceryRouter.put("/grocery-items/:id", authentication, authorizeRoles([UserRole.ADMIN]), updateGroceryItem);

/**
 * @route   DELETE /api/grocery-items/:id
 * @desc    Delete a grocery item (Admin only)
 * @access  Private (Admin)
 */
groceryRouter.delete("/grocery-items/:id", authentication, authorizeRoles([UserRole.ADMIN]), deleteGroceryItem);

export default groceryRouter;
