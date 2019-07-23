const jwt = require('jsonwebtoken');
const configJwt = require("../../config/config");

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        const decoded = jwt.verify(token, configJwt.jwtKey);
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
                message: 'Auth Failed'
        })
    }
}