const jwt = require('jsonwebtoken');
const configJwt = require("../../config/config");

module.exports = (req, res, next) => {
    let decoded;
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    try{
        // const token = req.headers.authorization.split(" ")[1];
        const token = authHeader.split(' ')[1];
        console.log(token);
        // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        decoded = jwt.verify(token, configJwt.jwtKey);
        req.userData = decoded;
        // next();
    } catch(error) {
        throw error;
    }
    req.userId = decoded.userId;
    next();
};