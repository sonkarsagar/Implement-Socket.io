require('dotenv').config()
const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')

const User=require('./models/user')
const sequelize=require('./util/database')
const bcrypt=require('bcrypt')

app.use(cors({
    origin: 'http://localhost:5500',
}))

app.use(bodyParser.json())

app.post('/postUser', (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        User.create({
            first: req.body.first,
            sur: req.body.sur,
            email: req.body.email,
            password: hash
        }).then((result) => {
            res.status(201).json(result)
        }).catch((err) => {
            res.status(400).json(err)
            console.log(err);
        });
        if(err){
            console.log(err);
        }
    })
})

app.post('/login',(req,res,next)=>{
    User.findOne({where: {email: req.body.email}}).then((response) => {
        if(response){
            bcrypt.compare(req.body.password, response.password, function(err, result) {
                res.status(201).json(result)
                if(err){
                    console.log(err);
                }
            });
        }else{
            res.status(201).json(false)
        }
        
    }).catch((err) => {
        console.log(err);
    });
})

app.get('/', (req, res, next)=>{
    res.send('<h1>Backend Is Working</h1>')
})

sequelize
.sync()
// .sync({force: true})
.then((result) => {
    app.listen(3000)
}).catch((err) => {
    console.log(err);
});