// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// const authorize = (req, res, next) => {
//   const token = req.header("Authorization");
//   const UserId=jwt.verify(token, process.env.TOKEN_SECRET)
//   User.findByPk(UserId.id).then((result) => {
//     req.user=result
//     next()
//   }).catch((err) => {
//     console.log(err);
//   });
// }

// module.exports = { authorize };

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path=require('path')

const authorize = (req, res, next) => {
  const token = req.header("Authorization");
  if(token){
    const UserId=jwt.verify(token, process.env.TOKEN_SECRET)
    User.findByPk(UserId.id).then((result) => {
      req.user=result
      next()
    }).catch((err) => {
      console.log(err);
    });
  }else{
    res.writeHead(301, {
      Location: `http://localhost:5500/FRONTEND/logIn/login.html`
    }).end();
    
    // res.sendFile(path.join(__dirname, '../FRONTEND/logIn/login.html'))
  }
  
}

module.exports = { authorize };
