const Router = require('express')
const router = new Router()
const configController = require('../controllers/configController')

// Получение конфига на клиенте
router.get('/', configController.getConfig)

// Создание ссылки на конфиг полученного с клиента
router.post('/', configController.postLinkForDownloadConfig)

module.exports = router