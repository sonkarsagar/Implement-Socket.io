const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const Leaderboard=sequelize.define('Leaderboard',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    totalIncome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    totalExpense: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})

module.exports=Leaderboard