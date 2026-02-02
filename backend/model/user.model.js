import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId, //a follower would have a (some bit 16-bit id assigned to them by mongoDB)
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId, //a follower would have a (some bit 16-bit id assigned to them by mongoDB)
        ref: "User",
        default: [],
      },
    ],

    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    links: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);


const model = mongoose.model("User", userSchema);

export default model;