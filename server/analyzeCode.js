const fs = require("node:fs")
const fsPromises = require("node:fs/promises")
const { exec } = require("child_process")
const glob = require('glob')
const downloadConfig = require('./downloadConfig2')
const path = require("path")
const config = require('./config/config.json')
// const checkFile = require('./config/rules')

const allErrorsInRepository = [];
const pathToJsonConfigFile = "./config/config.json"
const tempFolderName = 'tmp'
const repositoryPath = config.repositories[0].url
const repositoryURL = 'https://github.com/stxffyy/config'; //  URL репозитория с конфигом
const destinationFolder = './config'; // путь к папке, в которую скачается репозиторий
const readFrom = __dirname
// console.log('readFrom: ', readFrom)


// клонирование указанного репозитория в локальную папку.
function downloadRepository(repositoryPath) {
    return new Promise((resolve, reject) => {
        // папка для скачивания репозитория
        const folderName = path.resolve(tempFolderName, repositoryPath.split('/').slice(-1)[0])
        // console.log("tempFolderName: " + tempFolderName + "\n" + 'repositoryPath: ' + repositoryPath + "\n" + 'Folder name: ' + folderName)

        // клонирование репозитория в папку 
        exec(`cd ${tempFolderName} && git clone ${repositoryPath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return reject(error)
            }

            return resolve(folderName)
            // console.log(folderName)
        })
    })
}


// ф-ия рекурсивно удаляет все файлы и папки в указанной папке, а затем удаляет саму папку
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

// промис будет разрешен с массивом найденных файлов, если функция glob выполнена успешно, 
// или будет отклонен с ошибкой, если возникла ошибка при выполнении glob.
function promisifiedGlob(pattern, settings) {
    return new Promise((resolve, reject) => {
        glob(pattern, settings, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        })
    })

}

// ф-ия позволяет получить имя текущей ветки для указанного репозитория на GitHub
function getBranchName(repoUrl) {
    return new Promise((resolve, reject) => {
        const regex = /https:\/\/github\.com\/(.+)\/(.+)/;
        const matches = repoUrl.match(regex);

        const owner = matches[1];
        const repo = matches[2];

        // console.log(`Имя владельца: ${owner}`);
        // console.log(`Название репозитория: ${repo}`);

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const branchName = data[0].ref.split('/').pop();
                // console.log(`Имя текущей ветки: ${branchName}`);
                resolve(branchName);
            })
            .catch(error => {
                console.error('Ошибка при получении имени ветки:', error);
                reject(error);
            });
    });
}


// 
function getArrayOfMistakes(callback, pattern, code, filePath, repositoryPath) {
    const endOfFileObject = {
        pattern: pattern,
        asyncFunction: async () => {
            if (callback(code)) {
                return [];
            } else {
                try {
                    const branchName = await getBranchName(repositoryPath).catch(error => {
                        console.error('Ошибка при получении имени ветки:', error);
                        return '';
                    });

                    return [
                        {
                            message: `В данном файле отсутствует перенос строки в конце`,
                            lineNumber: code.split('\n').length,
                            columnNumber: 0,
                            filepath: filePath,
                            url: `Ссылка на ошибку: ${repositoryPath}/blob/${branchName}/${filePath}#L${code.split('\n').length}`,
                        }
                    ]
                } catch (error) {
                    console.error('Ошибка при получении имени ветки:', error);
                    return [];
                }
            }
        }
    };

    return endOfFileObject.asyncFunction;
}

async function executeGetArrOfMistakes(callback, pattern, code, filePath, repositoryPath) {
    const asyncFunction = getArrayOfMistakes(callback, pattern, code, filePath, repositoryPath);
    const errors = await asyncFunction(); // Ждем выполнения асинхронной функции и получаем результат
    // console.log(errors)
    allErrorsInRepository.push(...errors);
    // console.log(allErrorsInRepository); // Выводим результат
}

// Удаляет временную папку tempFolderName.
// Создает новую временную папку tempFolderName.
// Загружает данные из конфигурационного файла JSON.
// Для каждого репозитория и правила из конфигурации:
// Загружает репозиторий во временную папку.
// Для каждого файла, соответствующего шаблону правила:
// Читает содержимое файла.
// Выполняет функцию проверки правила и добавляет ошибки в массив allErrorsInRepository.
// Возвращает итоговый массив ошибок allErrorsInRepository.
async function analyze() {
    try {
        deleteFolderRecursive(tempFolderName);
    } catch (e) {
        console.log(e)
    }
    try {
        fs.mkdirSync(tempFolderName);
    } catch (e) {
        console.log(e);
    }
    try {
        downloadConfig(repositoryURL, destinationFolder)
    } catch (e) {
        console.log(e)
    }
    try {
        const data = require(pathToJsonConfigFile);

        for (let repository of data.repositories) {
            const pathToDownloadedRepository = await downloadRepository(repository.url);

            for (let rule of data.rules) {
                const pathToImplementation = rule.ruleImplementation //./rules/noNewLineAtTheEnd.js
                const updatedPathToImplementation = pathToImplementation.replace(/\.\/(.*)/, './config/$1') // ./config/rules/noNewLineAtTheEnd.js
                const ruleImplementation = require(updatedPathToImplementation);
                const pattern = rule.pattern
                const files = await promisifiedGlob(pattern, { cwd: pathToDownloadedRepository });

                for (let filePath of files) {
                    const code = (await fsPromises.readFile(path.resolve(pathToDownloadedRepository, filePath))).toString();
                    if (typeof ruleImplementation === 'function') {
                        await executeGetArrOfMistakes(ruleImplementation, pattern, code, filePath, repositoryPath)
                    } else {
                        console.error(`Функция проверки не найдена в файле реализации правила: ${updatedPathToImplementation}`);
                    }
                }
            }
        }
        console.log(allErrorsInRepository);
        return allErrorsInRepository;
    } catch (error) {
        console.error('Ошибка при анализе:', error);
        throw error;
    }
}

analyze()

module.exports = analyze

// async function analyze() {
//     try {
//         deleteFolderRecursive(tempFolderName);
//     } catch (e) {
//         console.log(e);
//     }
//     try {
//         fs.mkdirSync(tempFolderName);
//     } catch (e) { }
//     for (let item of collection) { // могу пробегаться не по этой коллекции, а по конфигу
//         // console.log('repositoryPath: ', item.repositoryPath);
//         const allErrorsInRepository = []
//         // клонирование указанного репозитория из коллекции
//         const pathToDownloadedRepository = await downloadRepository(item.repositoryPath);
//         // console.log('pathToDownloadedRepository: ', pathToDownloadedRepository);
//         for (let rule of item.rules) {
//             // rule в себе хранит ф-ию и паттерн
//             //console.log("rule: " + rule.pattern)
//             // получаем массив файлов из репо, которые удовл паттерну, чтобы их проверять на ошибки
//             const files = await promisifiedGlob(rule.pattern, { cwd: pathToDownloadedRepository });
//             // console.log("files: " + files)
//             for (let filePath of files) { // пробегаемся по массиву файлов
//                 // получаем код из каждого файла
//                 const code = (await fsPromises.readFile(path.resolve(pathToDownloadedRepository, filePath))).toString();
//                 //console.log("code: " + code);
//                 //console.log("filePath: " + filePath)
//                 // в rule лежит объект correctEndOfFile, ктр с свою очередь имеет поля pattern и function
//                 // errors - массив объектов для ошибок
//                 const errors = await rule.function(code, filePath);
//                 // console.log('errors: ' + errors[0].url)
//                 allErrorsInRepository.push(...errors);
//             }
//         }
//         // console.log('allErrorsInRepository', allErrorsInRepository);
//         return allErrorsInRepository;
//     }
// }
// analyze()


// const correctEndOfFile = {
//     pattern: '*(*.js|*.html|*.json|*.css)',
//     function: async (code, filepath) => {
//         if (checkFile(code)) {
//             return []
//         } else {
//             try {
//                 const branchName = await getBranchName(repositoryPath);
//                 return [
//                     {
//                         message: `В данном файле отсутствует перенос строки в конце`,
//                         lineNumber: code.split('\n').length,
//                         columnNumber: 0,
//                         filepath,
//                         url: `Ссылка на ошибку: ${repositoryPath}/blob/${branchName}/${filepath}#L${code.split('\n').length}`,
//                     }
//                 ]
//             } catch (error) {
//                 console.error('Ошибка при получении имени ветки:', error);
//                 return [];
//             }
//         }
//     }
// }

// // Правило на проверку \n в конце. Проверяет все файлы css, html, json, js
// const collection = [
//     {
//         repositoryPath: 'https://github.com/stxffyy/example3',
//         rules: [
//             correctEndOfFile
//         ]
//     },
//     // {
//     //     repositoryPath: 'https://github.com/stxffyy/example3',
//     //     rules: [
//     //         correctEndOfFile
//     //     ]
//     // }
// ]