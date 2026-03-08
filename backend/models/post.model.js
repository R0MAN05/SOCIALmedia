import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, //Specifies that this field must be a unique MongoDB ObjectId (the 24-character hex string).
        ref: 'User',  //Tells Mongoose that this ID points to a document in the 'User' collection, enabling "population" (linking data).
        required: true,  //Ensures a post cannot be saved unless it is linked to a user.
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    likes: [     //An Array ([]) of User ObjectIds. This keeps track of every user who liked the post to prevent duplicate likes and show total counts.
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    comments: [   //An Array of Objects. Each object represents a single comment containing its own text (the message) and a user (who wrote it).
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        },
    ],


}, { timestamps: true });

const post = mongoose.model('Post', postSchema);

export default post;
