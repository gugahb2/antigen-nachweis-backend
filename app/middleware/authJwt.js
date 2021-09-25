const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"] && req.headers["authorization"].split(' ')[1];

    if (!token) {
        return res.status(401).send({
            msg: ["No token provided!"]
        });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                msg: ["Unauthorized!"]
            });
        }
        req.user_id = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
};
module.exports = authJwt;
