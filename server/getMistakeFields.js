require('dotenv').config()
const { Mistake } = require('./models/models')
const sequelize = require('./database')
let arrOfMistakesFields = []

async function getMistakeFields() {
    try {
        // Подключение к БД
        await sequelize.authenticate();
        console.log('Успешное подключение к БД');

        // Синхронизация моделей с таблицами в БД
         await sequelize.sync();

        // Получение всех записей из таблицы "mistakes"
        const mistakes = await Mistake.findAll();

        // Перебор каждой записи и извлечение значений полей "message" и "url"
        mistakes.forEach(mistake => {
            const message = mistake.message;
            const url = mistake.url;
            const result = `Сообщение: ${message} ${url}`
            arrOfMistakesFields.push(result)
        });
        return arrOfMistakesFields
        
    } catch (error) {
        console.error("Ошибка при получении данных из БД:", error);
    }
}

// Вызов функции для извлечения значений полей "message" и "url"
// getMistakeFields();

module.exports = getMistakeFields