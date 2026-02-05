import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // if the user is fount return it.
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  //controller to handle follow and unfollow the searched(selected/particular) user
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id); //find the user to modify by their id.
    const currentUser = await User.findById(req.user._id); //get the current user using their id

    // self user follow and unfollow option handle:
    if (id === req.user._id.toString()) {
      //req.user._id.toString() cuz user._id is inside an object so the format is "_id": "" currently so changed to string to check in correct format.
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow yourself" });
    }

    // if (client)user or the another user that the client trying to follow or unfollow doesnt exists:
    if (!userToModify || !currentUser)
      return res.staus(400).json({ error: "User not found." });

    const isFollowing = currentUser.following.includes(id); //get the following user by their id.

    // to perform follow or unfollow on the basis of current status: if following then unfollow OR follow if not following.
    if (isFollowing) {
      // on the another user's end:
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      // findByIdAndUpdate(id, {$pull: { followers: req.user._id}}) basically passed the id of the userToModify and pulled(removed) the id of currentUser from userToModify's followers [] array.

      // on the client's end:
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      // findByIdAndUpdate(req.user._id, {$pull: {following: id}}) basically passed the id of currentUser and pulled the id of the previously following user(userToModify) from currentUser's following [] array.

      res.status(200).json({ message: "User unfollowed successfully" });
    }

    // if not following, to now follow:
    else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // LATER ADD THE NOTIFICATION FEATURE FOR THE USER WHO JUST GOT FOLLOWED.
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      // TODO: return the id of user as a response not a message.
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = req.user._id; //the current user got all details by id.
    const usersFollowedByMe =
      await User.findById(currentUser).select("following"); // accessed/selected only the following[] array of currentUser to make suggestedUsers.

    //Use MONGODB's aggregate() when you need a multi-step pipeline to transform, filter, join, group, sort, or sample documents in the database.
    // here below it’s used to $match and then $sample, which can’t be done with a single find() call. Use find() for simple queries; use aggregate() for pipelines.
    const users = await User.aggregate([
      {
        $match: {   
          _id: { $ne: currentUser },   //get all the user's who has an id. except us the currentUser. "ne" means not equals to.
        },
      },
      {
        $sample: { size: 10 },   //got only 10 users from the database.
      },
    ]);

    const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id)); //filtered out the unfollowed users (new users for suggestions).
    // It builds a new array that excludes anyone you already follow.
    // For each user in users, it checks if usersFollowedByMe.following includes that user._id. The ! flips it, so only users not in your following list remain.
    const suggestedUsers = filteredUsers.slice(0, 4); // takes the first 4 users from filteredUsers and stores them in suggestedUsers.

    suggestedUsers.forEach((user) => (user.password = null)); //loops through those 4 users and sets password to null so it won’t be sent back in the response.
  
    res.status(200).json(suggestedUsers);
  } catch (error) {}
};
