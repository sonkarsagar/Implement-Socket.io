const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const User=sequelize.define('Users',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    first: {
        allowNull: false,
        type: Sequelize.STRING
    },
    sur: {
        allowNull: false,
        type: Sequelize.STRING
    },
    email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        allowNull: false,
        type: Sequelize.STRING
    }
})

module.exports=User