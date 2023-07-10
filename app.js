require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Chat = require("./models/chat");
const sequelize = require("./util/database");
const bcrypt = require("bcrypt");

const authorization = require("./authorization/auth");

app.use(
  cors({
    origin: "http://localhost:5500",
  })
);

app.use(bodyParser.json());

app.post("/postUser", (req, res, next) => {
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
  });
});

app.get("/getUser/:UserId", authorization.authorize, (req, res, next) => {
  User.findByPk(req.params.UserId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/postChat", authorization.authorize, (req, res, next) => {
  User.findOne({ where: { id: req.user.id } })
    .then((result) => {
      Chat.create({
        chat: req.body.chat,
        UserId: result.id,
      })
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/getChat/:MessageId", (req, res, next) => {
  if (req.params.MessageId=='undefined') {
    Chat.findAll().then((result) => {
      if(result){
        res.json(result.slice(-11))
      }
    }).catch((err) => {
        console.log(err);
    });
  }else{
    Chat.findAll().then((result) => {
      if(result){
        lastLSId=req.params.MessageId
        lastId=result.slice(-1)[0].id
        if(lastLSId<lastId){
          res.json(result.slice(lastLSId,lastId))
        }
      }
    }).catch((err) => {
        console.log(err);
    });
  }
});

app.post("/login", (req, res, next) => {
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

app.get("/", (req, res, next) => {
  res.send("<h1>Backend Is Working</h1>");
});

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
  .sync()
  // .sync({force: true})
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
