require('dotenv').config()
const analyze = require('./analyzeCode');
const {Mistake} = require('./models/models')
const sequelize = require('./database')

// Функция для сохранения ошибок в БД
async function saveErrorsToDatabase() {
    try {
        // Подключение к БД
        await sequelize.authenticate();
        console.log('Успешное подключение к БД');

        // Синхронизация моделей с таблицами в БД
        await sequelize.sync();

        // Получение массива ошибок
        const mistakes = await analyze();
        // console.log(mistakes)

        for (const error of mistakes) {
            const mistake = {
                message: error.message,
                lineNumber: error.lineNumber,
                filePath: error.filepath,
                url: error.url,
                repositoryId: 1, // Пример значения для repositoryId
                ruleId: 1, // Пример значения для ruleId
                jiraTaskId: 1, // Пример значения для jiraTaskId
            };

            await Mistake.create(mistake);
            console.log('Ошибки успешно сохранена в БД');
        }


        // Закрытие соединения с БД
        await sequelize.close();
        console.log('Соединение с БД закрыто');
    } catch (error) {
        console.error('Ошибка при сохранении в БД:', error);
    }
}

saveErrorsToDatabase();
