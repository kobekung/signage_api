const db = require("../../config/database");

const findByLayoutId = async (layoutId) => {
  // [Postgres] ใช้ $1
  return await db.query('SELECT * FROM "widgets" WHERE layout_id = $1', [layoutId]);
};

const create = async (widgetData) => {
  return await db.insert("widgets", widgetData);
};

const deleteByLayoutId = async (layoutId) => {
  // [Postgres] ใช้ $1
  return await db.query('DELETE FROM "widgets" WHERE layout_id = $1', [layoutId]);
};

module.exports = {
  findByLayoutId,
  create,
  deleteByLayoutId
};