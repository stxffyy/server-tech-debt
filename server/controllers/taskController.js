require('dotenv').config()
const sendRequest = require('../functions/createTickets');

class TaskController {
  createTask(req, res) {
    const { description, summaryName } = req.body;
    // console.log('description', description, "\n","summaryName", summaryName)

    sendRequest('POST', process.env.JIRA_REQUEST_URL, description, summaryName)
      .then(response => {
        const taskId = response.key
        // const taskUrl = `https://stxffyy.atlassian.net/jira/software/c/projects/DEB/boards/2/backlog?view=detail&selectedIssue=${taskId}&issueLimit=100`;
        const taskUrl = `${process.env.USER_JIRA_BASE_URL}/jira/software/c/projects/${process.env.JIRA_PROJECT}/boards/${process.env.JIRA_BOARD_ID}/backlog?view=detail&selectedIssue=${taskId}&issueLimit=100`;

        res.json({ taskUrl });
      })
      .catch(error => {
        console.error('Ошибка при создании задачи:', error)
        res.sendStatus(500)
      })
  }
}

module.exports = new TaskController();
