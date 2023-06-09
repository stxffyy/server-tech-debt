const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);

module.exports = router;
