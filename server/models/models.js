const sequelize = require('../database')
const { DataTypes } = require('sequelize')

const Mistake = sequelize.define("mistake", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    lineNumber: { type: DataTypes.INTEGER },
    filePath: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false, unique: true },
    jiraTaskId: { type: DataTypes.INTEGER, allowNull: false },
    ruleId: { type: DataTypes.INTEGER, allowNull: false },
    repositoryId: { type: DataTypes.INTEGER, allowNull: false },
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