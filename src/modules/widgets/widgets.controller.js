const widgetsService = require('./widgets.service');

const createWidget = async (req, res) => {
  try {
    const result = await widgetsService.createWidget(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createWidget };