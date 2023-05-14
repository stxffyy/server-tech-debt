const Router = require('express')
const router = new Router()
const employeeController = require('../controllers/employeeController')

// получение списка задач для конкретного работника
router.get('/employee/:id/tasks', employeeController.getTasksEmployee)

// получение списка работников
router.get('/employee', employeeController.getEmployee)

// получение работника по ID
router.get('/employee/:id', employeeController.getEmployeeById)

// создание нового работника
router.post('/employee', employeeController.createEmployee)

// обновление работника по ID
router.put('/employee/:id', employeeController.updateEmployee)

// удаление работника по ID
router.delete('/employee/:id', employeeController.deleteEmployee)

module.exports = router