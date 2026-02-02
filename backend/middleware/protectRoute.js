import User from "../model/user.model.js"
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // to get the jwt cookie like this we need to add a middleware in server.js 

        // if the token cant be retrieved:
        if(!token) {
            return res.status(401).json({ error: "Unauthorized No Token Provided"});
        }

        // if we got the token decode it:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if the token doesn't get decoded(invalid token):
        if(!decoded) {
            return res.status(400).json({ error: "Unauthorized: Invalid Token"});
        }

        // if the token is decoded success
        const user = await User.findById(decoded.userId).select("-password"); //using the userId created by DB which was passed to the token as a playload when created, we use it to find the user in the DB and return this decoded token back to the client by removing the password field.

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        req.user = user;   //into the request object add this user field.
        next();  //and at last call the last function.
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
}