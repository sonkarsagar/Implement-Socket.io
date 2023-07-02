const express=require('express')
const router=express.Router()
const auth = require("../authorization/auth");
const expenseControl=require('../controllers/expenseControl')

// router.get("/expense", auth.authorize, expenseControl.getExpense);
  
router.get("/expense/premium", auth.authorize, expenseControl.getexpensePremium);

router.get('/expense/pagination', auth.authorize, expenseControl.getExpense)

router.post("/expense/successTransaction", auth.authorize, expenseControl.postexpenseSuccess);

router.post("/expense/failTransaction", auth.authorize, expenseControl.postexpenseFail);
  
router.post("/expense", auth.authorize, expenseControl.postExpense);
  
router.delete("/expense/:id", expenseControl.deleteExpense);

router.get('/expense/premium/leaderboard', expenseControl.getpremiumLeaderboard);

router.get("/expense/download", auth.authorize, expenseControl.getexpenseDownload);
  
module.exports=router