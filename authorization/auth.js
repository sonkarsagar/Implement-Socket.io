const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authorize = (req, res, next) => {
  const token = req.header("Authorization");
  const UserId=jwt.verify(token, process.env.TOKEN_SECRET)
  User.findByPk(UserId.id).then((result) => {
    req.user=result
    next()
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = { authorize };
