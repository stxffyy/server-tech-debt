const sequelize = require('./../db')

const {DataTypes} = require('sequelize')

// описание моделей (ошибка, правило, задача, работник, репозиторий, юзеры)

// Ошибка
const Mistake = sequelize.define("mistake", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    message: {type: DataTypes.TEXT, allowNull: false},
    lineNumber: {type: DataTypes.INTEGER},
    filePath: {type: DataTypes.STRING, allowNull: false},
    url: {type: DataTypes.STRING, allowNull: false},
    //priority: {type: DataTypes.INTEGER, allowNull: false},
})

console.log(Mistake)

// Правило
const Rule = sequelize.define("rule", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    // condition JSONB NOT NULL,
    // поле "condition" будет содержать информацию о том, как определить ошибку в коде и какую задачу создавать на ее основе.
})

// Задача
const Task = sequelize.define("task", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    creationDate: {type: DataTypes.INTEGER, allowNull: false},
    priority: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.ENUM("выполнена", "в процессе", "не выполнена"), defaultValue: 'не выполнена'},
    // assignee_id INTEGER REFERENCES users(id),
    // Связь между задачей и пользователем будет осуществляться через поле "assignee_id".
})

// Работник
const Employee = sequelize.define("employee", {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    position: {type: DataTypes.STRING, allowNull: false},
})

// Репозиторий
const Repository = sequelize.define("repository", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    url: {type: DataTypes.STRING, allowNull: false},
})

//Репозитории и Работники
const EmployeeRepository = sequelize.define("employee_repository", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

//=========================================================================
//описание связей моделей

// Связи один-ко-многим 

// между репозиторием и ошибками
Repository.hasMany(Mistake)
Mistake.belongsTo(Repository)

Employee.hasMany(Task)
Task.belongsTo(Employee)

Rule.hasMany(Mistake)
Mistake.belongsTo(Rule)
//-----------------------------------------------------------------------------

// Связи один-к-одному
Mistake.hasMany(Task)
Task.belongsTo(Mistake)

//------------------------------------------------------------------------------

// Связь многие-ко-многим межу работником и репозиториями
Employee.belongsToMany(Repository, { through: EmployeeRepository })
Repository.belongsToMany(Employee, { through: EmployeeRepository })



//экспорт моделей

module.exports = {
    Mistake,
    Rule,
    Task,
    Employee,
    Repository,
    EmployeeRepository
}