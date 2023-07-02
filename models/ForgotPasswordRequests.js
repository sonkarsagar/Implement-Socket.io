const Sequelize=require('sequelize')
const sequelize=require('../util/database')
const ForgotPasswordRequests=sequelize.define('ForgotPasswordRequests',{
    id:{
        type: Sequelize.STRING,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isActive:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports=ForgotPasswordRequests