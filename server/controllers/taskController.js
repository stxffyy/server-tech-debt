const sendRequest = require('../functions/createTickets');

class TaskController {
  createTask(req, res) {
    const { description, summaryName } = req.body;
    // console.log('description', description, "\n","summaryName", summaryName)

    const requestUrl = 'https://stxffyy.atlassian.net/rest/api/2/issue';

    sendRequest('POST', requestUrl, description, summaryName)
      .then(response => {
        const taskId = response.key
        const taskUrl = `https://stxffyy.atlassian.net/jira/software/c/projects/DEB/boards/2/backlog?view=detail&selectedIssue=${taskId}&issueLimit=100`;

        res.json({ taskUrl });
      })
      .catch(error => {
        console.error('Ошибка при создании задачи:', error)
        res.sendStatus(500)
      })
  }
}

module.exports = new TaskController();

// const sendRequest = require('../functions/createTickets');

// class TaskController {
//   createTask(req, res) {
//     const { description, summaryName, requestUrl } = req.body;
//     // console.log('description', description, "summaryName", summaryName, 'requestUrl', requestUrl)

//     // sendRequest('POST', requestUrl, description, summaryName)
//     //   .then(response => {
//     //     const taskId = response.key
//     //     const taskUrl = `https://stxffyy.atlassian.net/jira/software/c/projects/DEB/boards/2/backlog?view=detail&selectedIssue=${taskId}&issueLimit=100`;

//     //     res.json({ taskUrl });
//     //   })
//     //   .catch(error => {
//     //     console.error('Ошибка при создании задачи:', error)
//     //     res.sendStatus(500)
//     //   })
//   }
// }

// module.exports = new TaskController();

