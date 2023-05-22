//получаем роутер из экспресса
const Router = require('express')
//создаем объект этого роутера
const router = new Router()

//импортируем роутеры
const taskRouter = require('./taskRouter')
const employeeRouter = require('./employeeRouter')


//объединяем роутеры
// 1-й параметр - url, по ктр будет отрабатывать роутер
// 2-й - сам роутер
router.use('/employee', employeeRouter)
router.use('/task', taskRouter)


//экспортируем роутер
module.exports = router