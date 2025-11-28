const db = require("../../config/database");

const findAll = async (companyId) => {
  if (companyId) {
    return await db.query('SELECT * FROM buses WHERE company_id = ? ORDER BY id ASC', [companyId]);
  }
  return await db.query('SELECT * FROM buses ORDER BY id ASC');
};

const findByDeviceId = async (deviceId) => {
  const sql = `
    SELECT b.*, l.name as layout_name 
    FROM buses b 
    LEFT JOIN layouts l ON b.current_layout_id = l.id
    WHERE b.device_id = ?
  `;
  return await db.queryOne(sql, [deviceId]);
};

const create = async (data) => {
  return await db.insert("buses", data);
};

const update = async (id, data) => {
  return await db.update("buses", data, { id });
};

module.exports = { findAll, findByDeviceId, create, update };