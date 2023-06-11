require('dotenv').config()

const models = require('./models/models')
const sequelize = require('./database.js')
const express = require('express')
const cors = require('cors')
const router = require('./routers/index')

const PORT = process.env.PORT || 3010
//порт, на ктр будет работать наше приложение

const app = express()
// вызываем ф-юю express. С этого и будет начинаться запуск нашего приложения

app.use(cors())
app.use(express.json())
app.use('/api', router)


async function init(){
    await sequelize.authenticate()
    await sequelize.sync()
    console.log(`Server started on port ${PORT}`)
}

const server = app.listen(PORT, init)
server.on("close", sequelize.close)
