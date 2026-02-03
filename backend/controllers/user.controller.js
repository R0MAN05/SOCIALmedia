import User from "../model/user.model.js"

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if(!user){
        return res.status(404).json({ error: "User not found."});
    }

    // if the user is fount return it.
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: error.message});
  }
};
