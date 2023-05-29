const Router = require('express')
const router = new Router()
const analyzeController = require('../controllers/analyzeController');

// Маршрут для выполнения анализа кода
router.post('/', analyzeController.analyzeCode);

module.exports = router;
