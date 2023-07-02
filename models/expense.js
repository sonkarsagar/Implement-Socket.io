const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const expense=sequelize.define('expense',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull:false
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false
    },
    income:{
        type:Sequelize.STRING,
        allowNull: false
    },
    expense:{
        type:Sequelize.STRING,
        allowNull: false
    },
})

module.exports=expense