require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path')
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require('./models/group')
const GroupUser = require('./models/groupUser')
const sequelize = require("./util/database");
const raw = require('./util/rawdatabse')
const bcrypt = require("bcrypt");

const authorization = require("./authorization/auth");

const userRoutes = require('./routers/userRoute')
const loginRoutes = require('./routers/loginRoute');
const Sequelize = require("sequelize");

app.use(
  cors({
    origin: "http://localhost:5500",
  })
);

app.use(bodyParser.json());

app.use(userRoutes)
app.use(loginRoutes)

app.get('/groupParams/:groupName', authorization.authorize, (req, res, next) => {
  Group.create({
    name: req.params.groupName,
    UserId: req.user.id
  }).then((result) => {
    GroupUser.create({
      UserId: req.user.id,
      GroupId: result.id
    })
    res.json(result)
  }).catch((err) => {
    console.log(err);
  });
})

app.get('/group/getGroup', authorization.authorize, (req, res) => {
  raw.execute(`SELECT *
              FROM chatgroups cg
              JOIN groupusers gu
              ON cg.id=gu.GroupId
              WHERE gu.UserId=${req.user.id}`)
    .then((result) => {
      res.json(result[0])
    }).catch((err) => {
      console.log(err);
    });
})

app.get("/getUser/:UserId", authorization.authorize, (req, res, next) => {
  User.findByPk(req.params.UserId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get(`/copyLink`, authorization.authorize, async (req, res) => {
  raw.execute(`SELECT * FROM groupusers
  WHERE GroupId=${req.query.grpId} AND UserId=${req.user.id}`).then((result) => {
    if (!result[0][0]) {
      GroupUser.create({
        UserId: req.user.id,
        GroupId: parseInt(req.query.grpId)
      }).catch((err) => {
        console.log(err);
      });
    } else {
      res.status(401).send('Already a member.')

    }
  }).catch((err) => {
    console.log(err);
  });

})

app.post("/postChat", authorization.authorize, (req, res, next) => {
  Chat.create({
    chat: req.body.chat,
    UserId: req.user.id,
    chatgroupId: parseInt(req.body.chatgroupid)
  })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/group/getGroupChat/:GroupId', (req, res) => {
  Chat.findAll({ where: { chatgroupId: req.params.GroupId } }).then((result) => {
    res.json(result)
  }).catch((err) => {
    console.log(err);
  });
})

app.get("/getChat/", (req, res, next) => {
  if (req.query.MessageId == 'undefined') {
    raw.execute(`SELECT *
                FROM chats c
                JOIN chatgroups cg
                ON c.chatgroupId=cg.id`)
      .then((result) => {
        res.json(result[0])
      }).catch((err) => {
        console.log(err);
      });

    Chat.findAll().then((result) => {
      if (result) {
        res.json(result.slice(-10))
      }
    }).catch((err) => {
      console.log(err);
    });
  } else {
    Chat.findAll().then((result) => {
      if (result) {
        lastLSId = req.params.MessageId
        lastId = result.slice(-1)[0].id
        if (lastLSId < lastId) {
          res.json(result.slice(lastLSId, lastId))
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `./FRONTEND/${req.url}`))
})

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(Group)
Group.belongsTo(User)

Group.hasMany(Chat)
Chat.belongsTo(Group)

sequelize
  .sync()
  // .sync({force: true})
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
