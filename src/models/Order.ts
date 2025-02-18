import mongoose, { Document, Schema } from "mongoose";
import  IUser  from "./User";
import GroceryItem from "./GroceryItem";

// Correcting the type reference for the GroceryItem model
interface IOrderItem extends Document {
  groceryItem: typeof GroceryItem.schema.obj._id; // Adjusted to use schema _id type
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  user: typeof IUser.schema.obj._id;
  items: IOrderItem[];
  totalAmount: number;
  status: string;  // e.g., "pending", "completed"
}

const OrderItemSchema: Schema<IOrderItem> = new Schema(
  {
    groceryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroceryItem",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;