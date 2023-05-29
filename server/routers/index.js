//получаем роутер из экспресса
const Router = require('express')
//создаем объект этого роутера
const router = new Router()

//импортируем роутеры
const mistakeRouter = require('./mistakeRouter')
const configRouter = require('./configRouter')
const taskRouter = require('./taskRouter')
const analyzeRouter = require('./analyzeRouter')


//объединяем роутеры
// 1-й параметр - url, по ктр будет отрабатывать роутер
// 2-й - сам роутер
router.use('/mistake', mistakeRouter)
router.use('/config', configRouter)
router.use('/task', taskRouter)
router.use('/analyze', analyzeRouter)


//экспортируем роутер
module.exports = router