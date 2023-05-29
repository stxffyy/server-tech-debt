const Router = require('express')
const router = new Router()
const mistakeController = require('../controllers/mistakeController')

// Получение списка ошибок на клиенте
router.get('/', mistakeController.getMistakes)

module.exports = router;
