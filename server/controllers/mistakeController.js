const { Mistake } = require('../models/models')

class mistakeController {
    // для получения ошибок:
    async getMistakes(req, res) {
        try {
            const mistakes = await Mistake.findAll();
            res.status(200).json({ mistakes });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new mistakeController()