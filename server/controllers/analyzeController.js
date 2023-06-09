const { analyze } = require('../analyzeCode')

class AnalyzeController {
    async analyzeCode(req, res) {
        try {
            const result = await analyze();
            res.json(result);
            console.log(result)
        } catch (error) {
            console.error('Ошибка при выполнении анализа кода', error);
            res.status(500).json({ error: 'Ошибка при выполнении анализа кода' });
        }
        return res
    }
}

module.exports = new AnalyzeController();
