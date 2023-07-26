require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path')
const jwt = require("jsonwebtoken");
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const AWS = require("aws-sdk");
const cron = require('cron')

const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require('./models/group')
const GroupUser = require('./models/groupUser')
const Upload = require('./models/upload')
const ArchivedChat = require('./models/archivedChat')
const sequelize = require("./util/database");
const raw = require('./util/rawdatabse')
const bcrypt = require("bcrypt");

const authorization = require("./authorization/auth");

const userRoutes = require('./routers/userRoute')
const loginRoutes = require('./routers/loginRoute');
const Sequelize = require("sequelize");

app.use(cors({
  origin: "http://localhost:5500",
}));

app.use(bodyParser.json({ limit: '10mb' }));

async function myScript() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const date = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date}`;
  console.log('Cron Job executed');
  await raw.execute(`SELECT * 
              FROM Chats
              WHERE createdAt<'${formattedDate}'`).then((result) => {
    if (result[0][0]) {
      result[0].forEach(element => {
        ArchivedChat.create({
          id: element.id,
          chat: element.chat,
          UserId: element.UserId,
          chatgroupId: element.chatgroupId
        })
      })
    }
  }).catch((err) => {
    console.log(err);
  });
  await raw.execute(`DELETE FROM Chats
  WHERE createdAt<'${formattedDate}'`)
}

const cronJob = new cron.CronJob('* * * * *', myScript);
cronJob.start();

io.on("connection", (socket) => {
  socket.on('batman', (message) => {
    socket.broadcast.emit('renderChat', 'renderchat')
  })
})

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

app.get(`/removeMember/`, (req, res) => {
  GroupUser.destroy({ where: { UserId: req.query.memberId, GroupId: req.query.groupId } })
})

app.get('/group/getGroup', authorization.authorize, (req, res) => {
  raw.execute(`SELECT *
              FROM chatgroups cg
              JOIN GroupUsers gu
              ON cg.id=gu.GroupId
              WHERE gu.UserId=${req.user.id}`)
    .then((result) => {
      res.json(result[0])
    }).catch((err) => {
      console.log(err);
    });
})

app.get(`/groupInfo/:groupId`, authorization.authorize, (req, res) => {
  raw.execute(`SELECT cg.id AS groupid, cg.UserId AS admin, gu.UserId AS member
    FROM chatgroups cg
    JOIN GroupUsers gu
    ON cg.id=gu.GroupId
    WHERE cg.id=${req.params.groupId}`).then((result) => {
    if (req.user.id == result[0][0].admin) {
      result[0].push(true)
    } else {
      result[0].push(false)
    }
    res.send(result[0])

  }).catch((err) => {
    console.log(err);
  });
})

app.get(`/deleteGroup/:groupId`, authorization.authorize, (req, res) => {
  Group.findByPk(req.params.groupId).then((result) => {
    if (result.UserId == req.user.id) {
      Chat.destroy({ where: { chatgroupId: req.params.groupId } })
      GroupUser.destroy({ where: { GroupId: req.params.groupId } })
      Group.destroy({ where: { id: req.params.groupId } })
      res.status(201).send('Group Deleted')
    } else {
      res.status(401).send('Not the admin.')
    }
  }).catch((err) => {
    console.log(err);
  });
})

app.get("/getUser/:UserId", authorization.authorize, (req, res) => {
  User.findByPk(req.params.UserId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get(`/copyLink`, authorization.authorize, async (req, res) => {
  raw.execute(`SELECT * FROM GroupUsers
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

app.get("/getChat/", (req, res, next) => {
  if (req.query.MessageId == 'undefined') {
    raw.execute(`SELECT *
    FROM Chats c
    WHERE chatgroupId=${req.query.GroupId}`)
      .then((result) => {
        res.json(result[0])
      }).catch((err) => {
        console.log(err);
      });
  } else {
    Chat.findAll({ where: { chatgroupId: req.query.GroupId } }).then((result) => {
      if (result) {
        lastLSId = req.query.MessageId
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

app.post("/file/upload", authorization.authorize, async (req, res, next) => {
  fileData = JSON.stringify(req.body);
  let s3 = new AWS.S3({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  s3.upload({
    Bucket: "group-chat-ss-s3",
    Key: `${req.user.first} ${req.user.sur} Chat ${new Date()}.txt`,
    Body: fileData,
    ACL: "public-read",
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      Upload.create({
        link: data.Location,
        userId: req.user.id,
      });
      res.send(data);
    }
  });
});

app.use('/fetchbase64/:txt', (req, res) => {
  const s3 = new AWS.S3({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: "group-chat-ss-s3",
    Key: req.params.txt,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(Buffer.from(data.Body, 'base64').toString());
    }
  });

})

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `./FRONTEND/${req.url}`))
})

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(ArchivedChat);
ArchivedChat.belongsTo(User);

User.hasMany(Group)
Group.belongsTo(User)

Group.hasMany(Chat)
Chat.belongsTo(Group)

Group.hasMany(ArchivedChat)
ArchivedChat.belongsTo(Group)

User.hasMany(Upload)
Upload.belongsTo(User)

sequelize
  .sync()
  // .sync({force: true})
  .then((result) => {
    server.listen(3000)
  })
  .catch((err) => {
    console.log(err);
  });
