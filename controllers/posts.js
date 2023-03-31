import Post from "../models/Post.js"
import User from "../models/User.js"

// CREATE
export const createPost = async (req, res) => {
    try{
        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post ({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comment:[]
        })
        await newPost.save();

        // grab all the posts and send to the frontend
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

//  READ
export const getFeedPosts = async(req,res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUsersPosts = async (req,res) => {
    try{
        const {userId} = req.params;
        // getting all the posts of a userId
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

// UPDATE
export const likePost = async (req, res) => {
    try {
         const {id} = req.params;
         const {userId} = req.body;
         const post = await Post.findById(id);
         const isLiked = post.likes.get(userId);
        // if the user already liked the post then we delete his/her id from the liked list of that post
         if(isLiked) {
            post.likes.delete(userId);
         } else {
            post.likes.set(userId, true);
         }

         const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
         );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}