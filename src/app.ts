import express from "express";
import mongoose from "mongoose";
import cors  from "cors";
import router from "./routes";
import { mongo } from './config/config';

const app = express();
app.use(express.json());


app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(mongo.MONGO_CONNECTION)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(router);  

export default app;