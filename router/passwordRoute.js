const express = require("express");
const router = express.Router();
const passwordControl=require('../controllers/passwordControl')

router.post("/password/forgotpassword", passwordControl.forgot);

router.get("/password/resetpassword/:id", passwordControl.reset);

router.post("/password/update", passwordControl.update);

module.exports = router;
