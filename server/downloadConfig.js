const axios = require('axios');
const fs = require('fs');

// ф-ия для скачивания конфига
const downloadFile = async (url, path) => {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    response.data.pipe(fs.createWriteStream(path));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log('Файл успешно скачан!');
        resolve();
      });

      response.data.on('error', (err) => {
        console.error('Ошибка при скачивании файла:', err);
        reject(err);
      });
    });
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    throw err;
  }
};

const fileUrl = 'https://raw.githubusercontent.com/stxffyy/config1/master/data.json'
const savePath = '/Users/kate/Documents/TechDebt-main/config/config.json';

downloadFile(fileUrl, savePath)
  .then(() => {
    console.log('Загрузка завершена.');
  })
  .catch((err) => {
    console.error('Произошла ошибка:', err);
  });

  downloadFile(fileUrl, savePath)
  .then(() => {
    console.log('Загрузка завершена.');
  })
  .catch((err) => {
    console.error('Произошла ошибка:', err);
  });
