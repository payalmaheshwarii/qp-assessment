import mongoose, { Document, Schema } from "mongoose";

interface IGroceryItem extends Document {
  name: string;
  description: string;
  price: number;
  inventoryCount: number;
}

const GroceryItemSchema: Schema<IGroceryItem> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    inventoryCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const GroceryItem = mongoose.model<IGroceryItem>("GroceryItem", GroceryItemSchema);

export default GroceryItem;