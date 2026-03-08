import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";



dotenv.config();
cloudinary.config({     //with this we are now connected with cloudinary account now can be used to upload and delete images. use in user.controller for updateUserProfile.
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;  

//MIDDLEWARES
app.use(express.json());    // to get access to data using req.body
app.use(express.urlencoded({ extended: true}));    // to parse form data(urlencoded)
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

connectDB().then( () => {    //first connect the DB then run the app.
  app.listen(PORT, () => {
    console.log("Server started on PORT", PORT);
  });
})