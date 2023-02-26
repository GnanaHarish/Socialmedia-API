const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashPassword;
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json(user);
        }
        catch (Err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You cant update this account");
    }
})

//DELETE

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("user has been deleted");
        }
        catch (Err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You cant Delete this account");
    }
})

//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, isAdmin, ...others } = user._doc;
        res.status(200).json(others);
    }
    catch (err) {
        res.status(404).json("User not found")
    }
})

//Follow User
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User followed successfully");
            }
            else {
                res.status(403).json("You Already Follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cant follow yourself");
    }
})

//Unfollow User
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User unfollowed successfully");
            }
            else {
                res.status(403).json("You not following this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cant unfollow yourself");
    }
})
module.exports = router