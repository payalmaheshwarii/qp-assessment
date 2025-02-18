import { Response } from "express";
import mongoose from "mongoose";
import GroceryItem from "../models/GroceryItem";
import Order from "../models/Order";
import { JwtRequest } from "../middleware/authMiddleware";

// Helper function to validate order items
const validateAndPrepareOrder = async (items: { groceryItemId: string; quantity: number }[]) => {
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
        const groceryItem = await GroceryItem.findById(item.groceryItemId);
        if (!groceryItem) throw new Error(`Item ${item.groceryItemId} not found`);
        if (groceryItem.inventoryCount < item.quantity) throw new Error(`Not enough stock for item ${groceryItem.name}`);

        const price = groceryItem.price * item.quantity;
        orderItems.push({ groceryItem: groceryItem._id, quantity: item.quantity, price });
        totalAmount += price;
    }

    return { orderItems, totalAmount };
};

// Place an order
export const placeOrder = async (req: JwtRequest, res: Response): Promise<any>  => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized: User not found" });

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid request: 'items' must be a non-empty array" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderItems, totalAmount } = await validateAndPrepareOrder(items);

        const order = new Order({ user: req.user, items: orderItems, totalAmount, status: "Pending" });
        await order.save({ session });

        // Update inventory in bulk
        await GroceryItem.bulkWrite(
            items.map(item => ({
                updateOne: { filter: { _id: item.groceryItemId }, update: { $inc: { inventoryCount: -item.quantity } } }
            })),
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return res.status(400).json({ error: (error as Error).message || "Error placing order" });
    }
};
