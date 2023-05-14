const {Task, Employee} = require('../models/models')
// const ApiError = require('../error/ApiError')

class TaskController {

    // Контроллер для создания задачи:

    //для создания типа
    async createTask(req, res) {
        try {
            const task = await Task.create({
              title: req.body.title,
              description: req.body.description,
              priority: req.body.priority,
              status: 'не выполнена',
              employeeId: req.body.employeeId
            });
            res.status(201).json({ task });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    }

    // для получения списка задач:
    async getTasks(req, res) {
        try {
            const tasks = await Task.findAll();
            res.status(200).json({ tasks });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    }

    // для получения задачи по ID:
    async getTaskById(req, res) {
        try {
          const task = await Task.findByPk(req.params.id);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          res.status(200).json({ task });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      // назначение задачи на конкретного работника
      async assignTask(req, res) {
        const { taskId, employeeId } = req.body;
      
        try {
          // Проверяем, существуют ли задача и работник с заданными идентификаторами
          const task = await Task.findByPk(taskId);
          const employee = await Employee.findByPk(employeeId);
          if (!task || !employee) {
            return res.status(404).send('Task or employee not found');
          }
      
          // Назначаем задачу на работника
          await task.update({ assigneeId: employeeId });
          return res.status(200).send('Task assigned successfully');
        } catch (error) {
          console.error(error);
          return res.status(500).send('Error assigning task');
        }
      }

      // для получения списка задач, отсортированных по приоритету:
      async getTasksByPriority(req, res, next) {
        try {
          const tasks = await Task.findAll({
            order: [['priority', 'DESC']],
          });
          res.json(tasks);
        } catch (error) {
          next(error);
        }
      }
      

      // для обновления задачи:
      async updateTask(req, res) {
        try {
          const task = await Task.findByPk(req.params.id);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          const updatedTask = await task.update({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            status: req.body.status,
            employeeId: req.body.employeeId
          });
          res.status(200).json({ task: updatedTask });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      // Контроллер для удаления задачи:
      async deleteTask(req, res) {
        try {
          const task = await Task.findByPk(req.params.id);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          await task.destroy();
          res.status(204).end();
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }


      
}

module.exports = new TaskController()