const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

// req.user from auth.authorize via routes
exports.login = async (req, res, next) => {
  try {
    const response = await user.findOne({ where: { email: req.body.email } });
    if (response) {
      bcrypt.compare(req.body.password, response.password, (err, result) => {
        if (result) {
          response.dataValues.token = generateToken(response.id);
          res.status(200).send(response);
        } else {
          return res.status(401).json({ error: "Password doesn't match" });
        }
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

function generateToken(id) {
  return jwt.sign({ userId: id }, "chaabi",{expiresIn: '1h'});
}
