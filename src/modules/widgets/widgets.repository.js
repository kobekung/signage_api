const db = require("../../config/database");

const findByLayoutId = async (layoutId) => {
  // [MySQL] ใช้ ? แทน $1
  return await db.query("SELECT * FROM widgets WHERE layout_id = ?", [layoutId]);
};

const create = async (widgetData) => {
  return await db.insert("widgets", widgetData);
};

const deleteByLayoutId = async (layoutId) => {
  // [MySQL] ใช้ ? แทน $1
  return await db.query("DELETE FROM widgets WHERE layout_id = ?", [layoutId]);
};

module.exports = {
  findByLayoutId,
  create,
  deleteByLayoutId
};