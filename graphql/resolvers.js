const bcrypt = require('bcryptjs')
const User = require('../api/models/user');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const configJwt = require('../config/config');

module.exports = {
    createUser: async function({ userInput }, req) {
        const errors = [];
        if(!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-mail is invalid' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5})
        ) {
            errors.push({ message: 'Password too short' });
        }
        if (errors.length > 0) {
            const error = new Error('invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({email: userInput.email});
        if(existingUser){
            const error = new Error('User Exists Already !');
            throw error;
        }
        const user = new User({
            email: userInput.email,
            password: userInput.password
        });
        const createdUser = await user.save();
        console.log(createdUser);
        return{ ...createdUser._doc, _id: createdUser._id.toString() };
    },
    
    login: async function({ email, password }) {
        const user = await User.findOne({email: email});
        if(!user) {
            const error = new Error('user not found');
            error.code = 401;
            throw(error);
        }
        const isEqual = await bcrypt.compareSync(password, user.password);
        if(!isEqual) {
            const error = new Error('Wrong Password');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: email,
                id: user._id
            },
            configJwt.jwtKey,
            {
                expiresIn: "1h"
            }
        );
        console.log(token);
        return { token: token, userId: user._id.toString() };
    }
};