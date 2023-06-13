require('dotenv').config()
const fs = require("node:fs")
const fsPromises = require("node:fs/promises")
const { exec } = require("child_process")
const glob = require('glob')
const path = require("path")
const saveMistakesToDatabase = require('./functions/addMistakesToDB')

const allMistakesInRepository = [];
const pathToJsonConfigFile = './config/config.json'
const tempFolderName = 'tmp'
// const readFrom = __dirname


// скачивание указанного репозитория в локальную папку tmp
async function downloadRepository(repositoryPath, token) {
    return new Promise((resolve, reject) => {
        // папка для скачивания репозитория
        const folderName = path.resolve(tempFolderName, repositoryPath.split('/').slice(-1)[0])
        console.log("tempFolderName: " + tempFolderName + "\n" + 'repositoryPath: ' + repositoryPath + "\n" + 'Folder name: ' + folderName)

        // клонирование репозитория в папку с использованием токена аутентификации
        exec(`cd ${tempFolderName} && git clone ${repositoryPath.replace('https://', `https://${token}@`)}`, (error, stdout, stderr) => {
            if (error) {
                return reject(error)
            }
            console.log(folderName)
            return resolve(folderName)
        })
    })
}
// downloadRepository("https://github.com/stxffyy/example3")

// рекурсивное удаление файлов и папки
async function deleteFolderRecursive(path) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            fs.readdir(path, (error, files) => {
                if (error) {
                    reject(error)
                    return
                }

                const promises = files.map((file) => {
                    const curPath = `${path}/${file}`
                    return new Promise((resolve, reject) => {
                        fs.lstat(curPath, (error, stats) => {
                            if (error) {
                                reject(error)
                                return
                            }

                            if (stats.isDirectory()) {
                                deleteFolderRecursive(curPath)
                                    .then(resolve)
                                    .catch(reject)
                            } else {
                                fs.unlink(curPath, (error) => {
                                    if (error) {
                                        reject(error)
                                    } else {
                                        resolve()
                                    }
                                })
                            }
                        })
                    })
                })

                Promise.all(promises)
                    .then(() => {
                        fs.rmdir(path, (error) => {
                            if (error) {
                                reject(error)
                            } else {
                                resolve()
                            }
                        })
                    })
                    .catch(reject)
            })
        } else {
            resolve()
        }
    })
}
// deleteFolderRecursive(tempFolderName)


// промис будет разрешен с массивом найденных файлов, если функция glob выполнена успешно, 
// или будет отклонен с ошибкой, если возникла ошибка при выполнении glob.
async function promisifiedGlob(pattern, settings) {
    return new Promise((resolve, reject) => {
        glob(pattern, { ...settings, nodir: true, mark: true }, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        })
    })
}


// ф-ия позволяет получить имя текущей ветки для указанного репозитория на GitHub
async function getBranchName(repoUrl) {
    try {
      const regex = /https:\/\/github\.com\/(.+)\/(.+)/;
      const matches = repoUrl.match(regex);
  
      const owner = matches[1];
      const repo = matches[2];
  
      console.log(`Имя владельца: ${owner}`);
      console.log(`Название репозитория: ${repo}`);
  
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        // console.log("data", data);
  
        const defaultBranch = data.default_branch;
        console.log(`Дефолтная ветка: ${defaultBranch}`);
        return defaultBranch;
      } else {
        throw new Error('Ошибка при получении имени ветки');
      }
    } catch (error) {
      console.error('Ошибка при получении имени ветки:', error);
      throw error;
    }
  }
//  getBranchName("https://github.com/airbnb/lottie-web")

async function getBitbucketDefaultBranch(repoUrl) {
    try {
      const regex = /https:\/\/bitbucket\.org\/(.+)\/(.+)/;
      const matches = repoUrl.match(regex);
  
      const owner = matches[1];
      const repo = matches[2];
  
      console.log(`Имя владельца: ${owner}`);
      console.log(`Название репозитория: ${repo}`);
  
      const apiUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}`;
  
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.BITBUCKET_USERNAME}:${process.env.BITBUCKET_PASSWORD}`).toString('base64')}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
  
        const defaultBranch = data.mainbranch.name;
        console.log(`Дефолтная ветка: ${defaultBranch}`);
        return defaultBranch;
      } else {
        throw new Error('Ошибка при получении имени ветки');
      }
    } catch (error) {
      console.error('Ошибка при получении имени ветки:', error);
      throw error;
    }
  }
//   getBitbucketDefaultBranch("https://bitbucket.org/stxffyy-diploma/tech-debt-client");
  


function getArrayOfMistakes(callback, code, filePath, repositoryPat, repoId, ruleId, ruleMessage, branchName) {
    const endOfFileObject = {
        asyncFunction: async () => {
            // console.error(code);
            if (callback(code)) {
                return []
            } else {
                try {
                    return [
                        {
                            message: ruleMessage,
                            lineNumber: code.split('\n').length,
                            columnNumber: 0,
                            filepath: filePath,
                            url: `${repositoryPat}/blob/${branchName}/${filePath}#L${code.split('\n').length}`,
                            ruleId: ruleId,
                            repositoryId: repoId,
                        }
                    ]
                } catch (error) {
                    console.error('Ошибка при получении имени ветки:', error);
                    return [];
                }
            }
        }
    }

    return endOfFileObject.asyncFunction;
}

async function executeGetArrOfMistakes(callback, code, filePath, repositoryPat, repoId, ruleId, ruleMessage, branchName) {
    const asyncFunction = getArrayOfMistakes(callback, code, filePath, repositoryPat, repoId, ruleId, ruleMessage, branchName);
    const mistakes = await asyncFunction();
    // console.log(mistakes) // возвращаются ошибки
    await saveMistakesToDatabase(mistakes)
    allMistakesInRepository.push(...mistakes);
}

// Удаляет временную папку tempFolderName.
// Создает новую временную папку tempFolderName.
// Загружает данные из конфигурационного файла JSON.
// Для каждого репозитория и правила из конфигурации:
// Загружает репозиторий во временную папку.
// Для каждого файла, соответствующего шаблону правила:
// Читает содержимое файла.
// Выполняет функцию проверки правила и добавляет ошибки в массив allMistakesInRepository.
// Возвращает итоговый массив ошибок allMistakesInRepository.

async function analyze() {
    try {
        await deleteFolderRecursive(tempFolderName);
        fs.mkdirSync(tempFolderName);

        const data = require(pathToJsonConfigFile);

        for (let repository of data.repositories) {
            const pathToDownloadedRepository = await downloadRepository(repository.url);
            const repoId = repository.id
            const repositoryPat = repository.url
            let branchName = ''

            if (repositoryPat.includes("github")) {
                branchName = await getBranchName(repositoryPat).catch(error => {
                    console.error('Ошибка при получении имени ветки:', error)
                    return ''
                })
            } else if (repositoryPat.includes("bitbucket")){
                branchName = await getBitbucketDefaultBranch(repositoryPat).catch(error => {
                    console.error('Ошибка при получении имени ветки:', error)
                    return ''
                })
            }
            

            for (let rule of data.rules) {
                const ruleId = rule.id
                const pathToImplementation = rule.ruleImplementation
                const ruleMessage = rule.description
                // console.log("message", ruleMessage)
                const updatedPathToImplementation = pathToImplementation.replace(/\.\/(.*)/, './config/$1')
                const ruleImplementation = require(updatedPathToImplementation)
                const pattern = rule.pattern
                const files = await promisifiedGlob(pattern, { cwd: pathToDownloadedRepository })
                console.log(files)

                for (let filePath of files) {
                    const code = (await fsPromises.readFile(path.resolve(pathToDownloadedRepository, filePath))).toString()
                    if (typeof ruleImplementation === 'function') {
                        await executeGetArrOfMistakes(ruleImplementation, code, filePath, repositoryPat, repoId, ruleId, ruleMessage, branchName)
                    } else {
                        console.error(`Функция проверки не найдена в файле реализации правила: ${updatedPathToImplementation}`)
                    }
                }
            }
        }
        console.log(allMistakesInRepository);
        return allMistakesInRepository;

    } catch (error) {
        console.error('Ошибка при анализе:', error);
        throw error;
    }
}
// analyze()

module.exports = {
    downloadRepository: downloadRepository,
    deleteFolderRecursive: deleteFolderRecursive,
    getArrayOfMistakes: getArrayOfMistakes,
    getBranchName: getBranchName,
    analyze: analyze
}
