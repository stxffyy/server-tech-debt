const fs = require('fs')
const path = require('path')
const downloadConfig = require('../functions/downloadConfig')

class configController {
    async getConfig(req, res) {
        // Полный путь к файлу JSON
        const filePath = path.join(__dirname, '../config', 'config.json')

        // Прочитать содержимое файла JSON
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                res.status(500).json({ error: 'Ошибка чтения данных' })
            } else {
                // Отправить данные в ответе
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            }
        })
    }

    async postLinkForDownloadConfig(req, res) {
        const text = req.body.text

        console.log('Принятый ссылка:', text)
        downloadConfig(text, './config')

        // Отправляем ответ клиенту
        res.send('Текст успешно принят на сервере.')
    }

}

module.exports = new configController