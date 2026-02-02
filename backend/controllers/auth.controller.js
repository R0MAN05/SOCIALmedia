import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/generateToken.js"; // Add this import

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    //Will check if the entered email by the user is valid or not.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    //Checks if the username is already taken.
    const existingUser = await User.findOne({
      username: username,
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Password must be of atleast of 6 character handle.
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    //Hashes the password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //if the user is new (newly registering user).
    const newUser = new User({
      fullName: fullName, //could also use the shorthand property like fullname, username, email, since the value is same.
      username: username,
      email: email,
      password: hashedPassword, // taking the password from the user, hashing it, using the hashed password then registering the newUser.
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save(); //save the new user to the database (with above details)

      res.status(201).json({
        _id: newUser._id, //note here dont password for the security and possible leaks.
        username: newUser.username,
        fullname: newUser.fullName,
        email: newUser.email,
        follower: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); //find by username since we defined it to be unique for every user in the model.
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    ); // compare the password that user passed and the one stored in database. the ?  and   ||   "" means if the entered password is not in DB then compare it with empty stirng, which will return false but its something we need to add to aviod bcrypt's some kind of throw error.

    // check if the username or password is incorrect.
    if (!username || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    //if credentials matches generate the token and cookie:
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id, //note here dont password for the security and possible leaks.
      username: user.username,
      fullname: user.fullName,
      email: user.email,
      follower: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    // When the browser receives this response, it will automatically delete the jwt cookie since it has expired.\
    // This effectively logs out the user by removing their authentication token from the client side.
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller:", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
}