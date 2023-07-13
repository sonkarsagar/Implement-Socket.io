const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const User=require('../models/user')
const jwt=require('jsonwebtoken')

router.post("/login", (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
      .then((response) => {
        if (response) {
          bcrypt.compare(
            req.body.password,
            response.password,
            function (err, result) {
              result = {
                value: result,
                token: generateAccessToken(response.id),
              };
              res.status(201).json(result);
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          res.status(400).json(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  function generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
  }

module.exports=router