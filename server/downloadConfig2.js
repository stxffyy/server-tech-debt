const gitClone = require('git-clone');
const fs = require('fs-extra');

const repositoryURL = 'https://github.com/stxffyy/config'; //  URL репозитория с конфигом
const destinationFolder = './config'; // путь к папке, в которую скачается репозиторий

function downloadConfig(repositoryURL, destinationFolder) {
    fs.emptyDir(destinationFolder, (error) => {
      if (error) {
        console.error('Ошибка при очистке папки:', error);
      } else {
        console.log('Папка успешно очищена');
        gitClone(repositoryURL, destinationFolder, null, (error) => {
          if (error) {
            console.error('Ошибка при клонировании репозитория:', error);
          } else {
            console.log('Репозиторий успешно склонирован');
          }
        });
      }
    });
  }

// downloadConfig(repositoryURL, destinationFolder);

module.exports = downloadConfig




