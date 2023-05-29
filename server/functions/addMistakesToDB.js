require('dotenv').config()
const { Mistake } = require('../models/models')

// Функция для сохранения ошибок в БД
async function saveMistakesToDatabase(mistakes) {
  return new Promise(async (resolve, reject) => {
    try {

      // await sequelize.authenticate();
      // console.log('Успешное подключение к БД');

      // await sequelize.sync();

      for (const error of mistakes) {
        const mistake = {
          message: error.message,
          lineNumber: error.lineNumber,
          filePath: error.filepath,
          url: error.url,
          repositoryId: error.repositoryId,
          ruleId: error.ruleId,
          jiraTaskId: 1,
        };

        try {
          await Mistake.create(mistake);
          console.log('Ошибки успешно сохранены в БД');
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Дубликат данных уже существует');
          } else {
            console.error('Ошибка при сохранении в БД:', error);
          }
        }
      }

      resolve();
    } catch (error) {
      console.error('Ошибка при сохранении в БД:', error)
      reject(error)
    }
  })
}

// saveMistakesToDatabase();

module.exports = saveMistakesToDatabase
