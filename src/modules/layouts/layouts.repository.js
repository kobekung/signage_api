const db = require("../../config/database");

const findAll = async () => {
  const sql = "SELECT * FROM layouts ORDER BY created_at DESC";
  return await db.query(sql);
};

const findById = async (id) => {
  return await db.queryOne("SELECT * FROM layouts WHERE id = ?", [id]);
};

const create = async (layoutData) => {
  return await db.insert("layouts", layoutData);
};

const update = async (id, data) => {
  // ใช้ db.update ที่เราเตรียมไว้ใน config/database.js
  return await db.update("layouts", data, { id });
};

const deleteById = async (id) => {
  // PostgreSQL ใช้ $1
  const sql = 'DELETE FROM "layouts" WHERE id = $1'; 
  return await db.query(sql, [id]);
};


module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById
};