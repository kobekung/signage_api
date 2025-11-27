const db = require("../../config/database");

const findByLayoutId = async (layoutId) => {
  // PostgreSQL ใช้ $1
  return await db.query('SELECT * FROM "widgets" WHERE layout_id = $1', [layoutId]);
};

const create = async (widgetData) => {
  return await db.insert("widgets", widgetData);
};

// [เพิ่ม] ฟังก์ชันลบ Widgets ทั้งหมดของ Layout หนึ่งๆ
const deleteByLayoutId = async (layoutId) => {
  const sql = 'DELETE FROM "widgets" WHERE layout_id = $1';
  return await db.query(sql, [layoutId]);
};

module.exports = {
  findByLayoutId,
  create,
  deleteByLayoutId // export เพิ่ม
};