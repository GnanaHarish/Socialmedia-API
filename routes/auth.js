const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISER
router.post("/register", async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        })

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
})

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            res.status(404).json("No User found with the credentials");
        }
        else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                res.status(404).json("Invalid Password");
            }
            res.status(200).json(user);
        }
    }
    catch (Err) {
        res.status(500).json(Err);
    }
})

module.exports = router