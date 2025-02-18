import { Request, Response } from "express";
import GroceryItem from "../models/GroceryItem";

// Add new grocery item (Admin only)
export const addGroceryItem = async (req: Request, res: Response) => {
    const { name, description, price, inventoryCount } = req.body;
    
    try {
        const groceryItem = new GroceryItem({ name, description, price, inventoryCount });
        await groceryItem.save();
        res.status(201).json({ message: "Grocery item added successfully", groceryItem });
    } catch (error) {
        console.error("Error adding grocery item:", error);
        res.status(500).json({ error: "Error adding grocery item" });
    }
};

// View all grocery items (Admin & User)
export const getGroceryItems = async (req: Request, res: Response) => {
    try {
        const items = await GroceryItem.find();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching grocery items:", error);
        res.status(500).json({ error: "Error fetching grocery items" });
    }
};

// Update grocery item (Admin only)
export const updateGroceryItem = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { name, description, price, inventoryCount } = req.body;

    try {
        const updatedItem = await GroceryItem.findByIdAndUpdate(
            id,
            { name, description, price, inventoryCount },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Grocery item not found" });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error updating grocery item:", error);
        res.status(500).json({ error: "Error updating grocery item" });
    }
};

// Remove grocery item (Admin only)
export const deleteGroceryItem = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const deletedItem = await GroceryItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: "Grocery item not found" });
        }

        res.status(200).json({ message: "Grocery item deleted successfully" });
    } catch (error) {
        console.error("Error deleting grocery item:", error);
        res.status(500).json({ error: "Error deleting grocery item" });
    }
};
