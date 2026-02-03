import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;  

//MIDDLEWARES
app.use(express.json());    // to get access to data using req.body
app.use(express.urlencoded({ extended: true}));    // to parse form data(urlencoded)
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

connectDB().then( () => {    //first connect the DB then run the app.
  app.listen(PORT, () => {
    console.log("Server started on PORT", PORT);
  });
})