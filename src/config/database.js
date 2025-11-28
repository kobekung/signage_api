"use strict";

const mysql = require("mysql2/promise");
const config = require("./index");

const pool = mysql.createPool({
  uri: config.database.url,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = {};

db.query = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("❌ Query Error:", e.message);
    throw e;
  }
};

db.queryOne = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows[0];
  } catch (e) {
    console.error("❌ QueryOne Error:", e.message);
    throw e;
  }
};

db.insert = async (table, data) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data).map(val => {
      if (val instanceof Date) return val;
      if (val !== null && typeof val === 'object') return JSON.stringify(val);
      if (val === undefined) return null;
      return val;
    });

    const columns = keys.map(k => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.execute(sql, values);

    // [FIX] ดึง ID ที่เพิ่ง Auto Increment มาใส่กลับใน object
    return { id: result.insertId, ...data };
  } catch (e) {
    console.error(`❌ Insert Error [${table}]:`, e.message);
    throw e;
  }
};

db.update = async (table, data, condition) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data).map(val => {
      if (val instanceof Date) return val;
      if (val !== null && typeof val === 'object') return JSON.stringify(val);
      if (val === undefined) return null;
      return val;
    });

    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    
    const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
    const whereClause = conditionKeys.map(k => `\`${k}\` = ?`).join(' AND ');

    const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
    
    await pool.execute(sql, [...values, ...conditionValues]);
    
    // Select ข้อมูลล่าสุดกลับมา
    const [rows] = await pool.execute(`SELECT * FROM \`${table}\` WHERE ${whereClause}`, conditionValues);
    return rows[0];
  } catch (e) {
    console.error(`❌ Update Error [${table}]:`, e.message);
    throw e;
  }
};

module.exports = db;