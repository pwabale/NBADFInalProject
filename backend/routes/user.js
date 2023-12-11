var express = require('express');
const router = express.Router();
var { User, validateUser } = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var Joi = require('joi');
const auth = require('../middelware/auth');


router.post("/signUp", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        email: req.body.email,
        password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    var result = await user.save();
    return res.send({
        email: result.email,
        _id: result._id
    });
});


router.post("/signIn", async (req, res) => {
    var schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required()
    });
    var { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid Email or Password');
    let result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send('Invalid Email or Password');
    var currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 100);

    let temp = { "_id": user._id, "email": user.email, expiration: currentDate };
    const token = jwt.sign(temp, "Hello");
    return res.json({
        token: token,
        _id: user._id,
        email: user.email
    });
});

router.get("/refresh", [auth], async (req, res) => {
    var currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 10);
    req.user.expiration = currentDate;
    const token = jwt.sign(req.user, "Hello");
    return res.json({
        token: token,
        _id: req.user._id,
        email: req.user.email
    });
});

module.exports = router;