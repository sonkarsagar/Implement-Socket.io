const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const User=require('../models/user')

router.post("/postUser", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      User.create({
        first: req.body.first,
        sur: req.body.sur,
        email: req.body.email,
        password: hash,
      })
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(400).json(err);
          console.log(err);
        });
      if (err) {
        console.log(err);
      }
    })
  });

module.exports=router