const sequelize = require('../database')
const { DataTypes } = require('sequelize')

const Mistake = sequelize.define("mistakes", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    lineNumber: { type: DataTypes.INTEGER },
    filePath: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    ruleId: { type: DataTypes.INTEGER, allowNull: false },
    repositoryId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: {type: DataTypes.STRING, allowNull: true, defaultValue: null}
})

 
const Project = sequelize.define("project", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    configUrl: { type: DataTypes.TEXT, allowNull: false },
    jiraToken: { type: DataTypes.INTEGER },
})


module.exports = {
    Mistake,
    Project,
}