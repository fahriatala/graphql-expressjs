const jwt = require('jsonwebtoken');
const configJwt = require("../../config/config");

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try{
        decoded = jwt.verify(token, configJwt.jwtKey);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if(!decoded) {
        req.isAuth = false;
        return next();
    }
    req.userId = decoded.id;
    req.isAuth = true;
    next();
}