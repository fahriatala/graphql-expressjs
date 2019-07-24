const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const configJwt = require("../../config/config");

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: "Email Unavailable"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } else{
                        const user = new User({
                            // _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });  
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });       
                    }
                });
            }
        })     
}

exports.userCreate = async (req, res, next) => {
    const input = req.body;
    try {
        const user = await User.create(input);
        // res.json(user)
        return res.status(201).json({
            message: 'User Created',
            data: user
        });
    } catch (error) {
        next(error)
    }
   
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if(result) {
                    const token = jwt.sign(
                        {
                          email: user[0].email,
                          userId: user[0]._id
                        },
                        configJwt.jwtKey,
                        {
                            expiresIn: "1h"
                        }
                      );
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token,
                        login: "login"
                    });
                }
                res.status(401).json({
                    message: 'Auth Failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.userLogin =  async (req, res) => {
    try{
        const checkUserEmail = await User.findOne({ email: req.body.email });
        if(!checkUserEmail) {
            return res.status(401).json({
                message: 'No Email Addres'
            });
        }
        if(bcrypt.compareSync(req.body.password, checkUserEmail.password)){
            const token = await jwt.sign(
                {
                    email: checkUserEmail.email,
                    id: checkUserEmail._id
                },
                configJwt.jwtKey,
                {
                    expiresIn: "1h"
                }
            )
            return res.status(200).json({
                message: 'Auth Successful',
                token: token
            });
        }else{
            res.status(401).json({
                message: 'Wrong Password'
            });
        }
    } catch (error){
        res.status(500).json({
            error: error
        });
    }
} 

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.userRemove =  async(req, res) => {
    try{
      const user = await User.deleteOne({ _id: req.params.userId });
      return res.status(200).json({
            message: 'User Deleted'
      });
    } catch(error){
      next(error)
    }
  };