import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;  

app.use("/api/auth", authRoutes);

connectDB().then( () => {    //first connect the DB then run the app.
  app.listen(PORT, () => {
    console.log("Server started on PORT", PORT);
  });
})