const jwt = require("jsonwebtoken");
require("dotenv").config();
// const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
//   let token = req.headers.authorization;
  const token = req.headers.authorization.split(' ')[1];
  console.log('token', token);
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
        console.log('err: ', err);
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;