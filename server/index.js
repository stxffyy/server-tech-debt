require('dotenv').config()

const models = require('./models/models')
const sequelize = require('./db.js')
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routers/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 3010
//порт, на ктр будет работать наше приложение

const app = express()
// вызываем ф-юю express. С этого и будет начинаться запуск нашего приложения

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

//Обработка ошибок, последний middleware
app.use(errorHandler)


const start = async () => {
    try {
        await sequelize.authenticate()
        //подключение к бд

        await sequelize.sync()

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
        // вызываем ф-юю listen, в ктр указываем порт, ктр должен прослушивать наш сервер
        // и колбэк, который сработает при успешном запуске сервера
    } catch(e) {
        console.log(e)
    }
}
start()