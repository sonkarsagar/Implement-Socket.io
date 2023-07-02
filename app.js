require("dotenv").config();
const express = require("express");
const app = express();

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs=require('fs')
const path=require('path')
const https=require('https')
const helmet=require('helmet')
const compression=require('compression')

const user = require("./models/user");
const expense = require("./models/expense");
const Orders = require("./models/orders");
const Leaderboard = require("./models/leaderboard");
const ForgotPasswordRequests = require("./models/ForgotPasswordRequests");
const Download=require('./models/download')

const loginRoute = require("./router/loginRoute");
const userRoute = require("./router/userRoute");
const expenseRoute = require("./router/expenseRoute");
const passwordRoute = require("./router/passwordRoute");
const auth = require("./authorization/auth");

const serverKey=fs.readFileSync('server.key')
const serverCert=fs.readFileSync('server.cert')

// app.use(helmet())
app.use(compression())

app.use(bodyParser.json());
app.use(cors());

app.use(loginRoute);

app.use(userRoute);

app.use(expenseRoute);

app.use(passwordRoute);

app.use((req,res,next)=>{
  console.log(req.url);
  // res.send('<h1>BACKEND IS WORKING</h1>')
  res.sendFile(path.join(__dirname, `FRONTEND/${req.url}`))
})

user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(Orders);
Orders.belongsTo(user);

Leaderboard.belongsTo(user);

user.hasMany(Download)
Download.belongsTo(user)

ForgotPasswordRequests.belongsTo(user);

sequelize
  .sync()
  // .sync({force: true})
  .then((res) => {
    // https.createServer({key:serverKey, cert:serverCert}, app).listen(3000)
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err);
  });
