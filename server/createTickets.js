const analyze = require('./analyzeCode');
require('dotenv').config()
const requestUrl = 'https://stxffyy.atlassian.net/rest/api/2/issue'


// получаем массив ошибок после анализа кода
function getAnalyze() {
    return new Promise((resolve, reject) => {
        analyze()
            .then((result) => {
                resolve(result);
                console.log(result)
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

// ф-ия для отправки запроса на Jira (создание тикетов)
function sendRequest(method, url, mistake, summaryname, body = null) {
    return new Promise((resolve, reject) => {
        const bodyData = {
            "fields": {
                "project": {
                    "id": "10001"
                },
                "summary": summaryname,
                "description": mistake,
                "issuetype": {
                    "id": "10005"
                }
            }
        };

        const headers = {
            'Authorization': `Basic ${Buffer.from(
                `${process.env.AUTH_JIRA_EMAIL}:${process.env.AUTH_JIRA_TOKEN}`
            ).toString('base64')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(bodyData)
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .then(resolve)
            .catch(reject);
    });
}

// модифицируем каждую ошибку из массива в строку и для каждой ошибки создаем тикет на Jira 
// mistakeString - описание в тикете
// summaryname - название тикета
async function modificateMistakes() {
    const result = await getAnalyze()
    const promises = result.map(mistake => {
        const mistakeString = JSON.stringify(mistake);
        //console.log("Ошибка в виде строки:\n" + mistakeString);
        const summaryName = mistake.message
        return sendRequest('POST', requestUrl, mistakeString, summaryName);
    });

    await Promise.all(promises);
}

modificateMistakes()