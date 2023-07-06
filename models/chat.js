const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const Chat=sequelize.define('Chats',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    chat: {
        allowNull: false,
        type: Sequelize.STRING
    },
    token:{
        allowNull: false,
        type: Sequelize.STRING
    }
})

module.exports=Chat