const mongoose = require('mongoose');
var Joi = require('joi');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

var User = mongoose.model("User", userSchema);

var validateUser = (user) => {
    const schema = Joi.object({
        password: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
    });
    return schema.validate(user);
};
module.exports.User = User;
module.exports.validateUser = validateUser;