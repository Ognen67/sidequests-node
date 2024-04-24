const jwt = require("jsonwebtoken");
require("dotenv").config();
// const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;

//   console.log('token', token);

//   if (!token) return res.status(401).json({ error: "Access denied" });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// }

// module.exports = verifyToken;

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