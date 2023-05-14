const {Employee} = require('../models/models')
const ApiError = require('../error/ApiError')

class EmployeeController {

    // для получения списка пользователей:
    async getEmployee(req, res) {
        try {
          const employees = await Employee.findAll();
          res.status(200).json({ employees });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      // для создания пользователя:
      async createEmployee(req, res) {
        try {
          const employee = await Employee.create({
            name: req.body.name,
            email: req.body.email,
            position: req.body.position
          });
          res.status(201).json({ employee });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      // для получения пользователя по ID:
      async getEmployeeById(req, res) {
        try {
          const employee = await Employee.findByPk(req.params.id);
          if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
          }
          res.status(200).json({ employee });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }


      // получение списка задач для конкретного работника
      async getTasksEmployee(req, res) {
        const { employeeId } = req.params;
      
        try {
          const tasks = await Task.findAll({
            where: { assignee_id: employeeId },
            include: {
              model: Employee,
              attributes: ['id', 'name'],
            },
          });
      
          res.json(tasks);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }

      // для обновления пользователя:
      async updateEmployee(req, res) {
        try {
          const employee = await Employee.findByPk(req.params.id);
          if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
          }
          const updatedEmployee = await employee.update({
            name: req.body.name,
            email: req.body.email,
            position: req.body.position
          });
          res.status(200).json({ employee: updatedEmployee });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      async deleteEmployee(req, res) {
        try {
          const employee = await Employee.findByPk(req.params.id);
          if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
          }
          await employee.destroy();
          res.status(204).end();
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
      
}

module.exports = new EmployeeController()