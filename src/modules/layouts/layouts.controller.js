const layoutService = require('./layouts.service');

const getLayouts = async (req, res) => {
  try {
    const layouts = await layoutService.getAllLayouts();
    res.json(layouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLayoutById = async (req, res) => {
  try {
    const layout = await layoutService.getLayoutById(req.params.id);
    if (!layout) return res.status(404).json({ message: "Not Found" });
    res.json(layout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLayout = async (req, res) => {
  try {
    const result = await layoutService.createLayout(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [เพิ่ม] Update Layout
const updateLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await layoutService.updateLayout(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [เพิ่ม] Delete Layout
const deleteLayout = async (req, res) => {
  try {
    const { id } = req.params;
    await layoutService.deleteLayout(id);
    res.json({ message: "Layout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLayouts,
  getLayoutById,
  createLayout,
  updateLayout, // export เพิ่ม
  deleteLayout  // export เพิ่ม
};