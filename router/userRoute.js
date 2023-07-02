const express=require('express')
const router=express.Router()
const auth = require("../authorization/auth");
const userControl=require('../controllers/userControl')

router.post("/user", userControl.postUser);
  
router.get('/user',auth.authorize, userControl.getUser)

module.exports=router