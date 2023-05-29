const fs = require('fs');
const path = require('path');

function checkForDangerousCode(config) {
    const dangerousCodePatterns = [
        /(\.|\s|;|^|`)delete(\s|`)/,
        /(\.|\s|;|^|`)drop(\s|`)/,
        /(\.|\s|;|^|`)truncate(\s|`)/,
    ];

    // Рекурсивная функция для проверки содержимого файлов и папок
    function checkFiles(directory) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                for (const pattern of dangerousCodePatterns) {
                    if (pattern.test(fileContent)) {
                        return false; // Обнаружен опасный код в файле
                    }
                }
            } else if (stats.isDirectory()) {
                const subDirectory = path.join(directory, file);
                if (!checkFiles(subDirectory)) {
                    return false; // Обнаружен опасный код в файле в подпапке
                }
            }
        }
        return true; // Нет обнаруженного опасного кода
    }

    // Проверка содержимого файлов и папок в репозитории
    for (const repository of config.repositories) {
        if (!checkFiles(repository.path)) {
            return false; // Обнаружен опасный код в репозитории
        }
    }

    return true; // Нет обнаруженного опасного кода
}
