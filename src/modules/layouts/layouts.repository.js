const db = require("../../config/database");

const findAll = async (companyId) => {
  if (companyId) {
    return await db.query('SELECT * FROM layouts WHERE company_id = ? ORDER BY created_at DESC', [companyId]);
  }
  return await db.query('SELECT * FROM layouts ORDER BY created_at DESC');
};

const findById = async (id) => {
  // [MySQL] ใช้ ? แทน $1
  return await db.queryOne("SELECT * FROM layouts WHERE id = ?", [id]);
};

const create = async (layoutData) => {
  return await db.insert("layouts", layoutData);
};

const update = async (id, data) => {
  return await db.update("layouts", data, { id });
};

const deleteById = async (id) => {
  // [MySQL] ใช้ ? แทน $1 และ `layouts`
  return await db.query("DELETE FROM layouts WHERE id = ?", [id]);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById
};