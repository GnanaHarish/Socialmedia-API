const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//Create a posts
router.post("/", async (req, res) => {
    const post = new Post(req.body);
    try {
        const savedPost = await post.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Upate post

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post Updated Sucessfully");
        }
        else {
            res.status(403).json("You cant update other person posts");
        }
    }
    catch (err) {
        res.status(500).json("Post not found");
    }

})

//Delete a post

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json("Post delete Sucessfully");
        }
        else {
            res.status(403).json("You cant delete other person posts");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }

})

//Like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post has been liked");
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(403).json("Post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }

})

//Get a post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//Get timeline post

router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
            currentUser.following.map((friendId => {
                return Post.find({ userId: friendId });
            }))
        );
        res.status(200).json(userPosts.concat(...friendsPosts));
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;