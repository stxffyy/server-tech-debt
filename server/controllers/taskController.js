require('dotenv').config()
const sendRequest = require('../functions/createTickets');
const { Mistake } = require('../models/models');

class TaskController {
  async createTask(req, res) {
    // console.log(req.body.id)
    const mistake = await Mistake.findByPk(req.body.id)

    let taskId = mistake.taskId

    if (mistake.taskId) {
      const taskUrl = `${process.env.USER_JIRA_BASE_URL}/jira/software/c/projects/${process.env.JIRA_PROJECT}/boards/${process.env.JIRA_BOARD_ID}/backlog?view=detail&selectedIssue=${taskId}&issueLimit=100`
      res.json({ taskUrl })
      console.log("задача уже создана")
      return
    } 

    const description = mistake.url
    const summaryName = mistake.message
  
    await sendRequest('POST', process.env.JIRA_REQUEST_URL, description, summaryName)
      .then(async response => {
        taskId = response.key
        mistake.taskId = taskId
        await mistake.save()
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
