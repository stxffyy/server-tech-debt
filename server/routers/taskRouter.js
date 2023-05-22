const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')

// получение списка задач
router.get('/tasks', taskController.getTasks)

// получение задачи по ID
router.get('/tasks/:id', taskController.getTaskById)

// создание новой задачи
router.post('/tasks', taskController.createTask)

// обновление задачи по ID
router.put('/tasks/:id', taskController.updateTask)

// удаление задачи по ID
router.delete('/tasks/:id', taskController.deleteTask)

// назначение задачи на конкретного работника
router.put('/tasks/:id/assign', taskController.assignTask)

// // получение списка задач, отсортированных по приоритету
// router.get('/tasks/priority', brandController.create)


module.exports = router