const gitClone = require('git-clone');
const fs = require('fs-extra');

const repositoryURL = 'https://github.com/stxffyy/config'; //  URL репозитория с конфигом
const destinationFolder = './config'; // путь к папке, в которую скачается репозиторий

async function downloadConfig(repositoryURL, destinationFolder) {
  return new Promise((resolve, reject) => {
    fs.emptyDir(destinationFolder, (error) => {
      if (error) {
        console.error('Ошибка при очистке папки:', error)
        reject(error)
      } else {
        console.log('Папка успешно очищена')
        gitClone(repositoryURL, destinationFolder, null, (error) => {
          if (error) {
            console.error('Ошибка при клонировании репозитория:', error)
            reject(error)
          } else {
            console.log('Репозиторий успешно склонирован');
            resolve()
          }
        });
      }
    });
  });
}

// downloadConfig(repositoryURL, destinationFolder);

module.exports = downloadConfig



