const db = require("../../config/database");

const findAll = async () => {
  return await db.query("SELECT * FROM companies ORDER BY id ASC");
};

const create = async (data) => {
  return await db.insert("companies", data);
};

module.exports = { findAll, create };