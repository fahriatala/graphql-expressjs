const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const configJwt = require('../config/config');

const User = require('../api/models/user');
const Product = require('../api/models/product');

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
    },
    createProduct: async function({ productInput }, req) {
        if(!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const errors = [];
        if(validator.isEmpty(productInput.name) || !validator.isLength(productInput.name, { min: 5 })) {
            errors.push({ message: 'Title is invalid' });
        }
        if(errors.length > 0) {
            const error = new Error('invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const user = await User.findById(req.userId);
        console.log(req);
        if(!user) {
            const error = new Error('Invalid User');
            error.code = 401;
            throw error;
        }
        const product = new Product({
            name: productInput.name,
            price: productInput.price,
            productImage: 'localhost:4000/' + productInput.productImage,
            creator: user
        });
         const createdProduct = await product.save();
        //  user.products.push(createdProduct);
        //  await user.save();
        console.log(createdProduct);
        return {...createdProduct._doc, _id: createdProduct._id.toString()};
    },
    products: async function({ page }, req) {
        if(!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        if (!page) {
            page = 1
        }
        const perPage = 5;
        const totalProducts = await Product.find().countDocuments();
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip((page -1 ) * perPage)
            .limit(perPage)
            .populate('creator');
        console.log(products);
        return {
            products: products.map(p => {
              return {
                ...p._doc,
                _id: p._id.toString(),
                createdAt: p.createdAt.toISOString(),
                // updatedAt: p.updatedAt.toISOString()
              };
            }),
            totalProducts: totalProducts
          };
    }
};