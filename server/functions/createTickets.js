require('dotenv').config()

// ф-ия для отправки запроса на Jira (создание тикетов)
function sendRequest(method, url, description, summaryName) {
    return new Promise((resolve, reject) => {
        const bodyData = {
            "fields": {
                "project": {
                    "id": "10001"
                },
                "summary": summaryName,
                "description": description,
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
                return response.json();
            })
            .then(resolve)
            .catch(reject);
    });
}

module.exports = sendRequest