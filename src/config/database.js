// "use strict";

// const mysql = require("mysql2/promise");
// const config = require("./index");

// // [FIX] เช็คว่าถ้ามีค่า url ให้ส่ง String ไปตรงๆ, ถ้าไม่มีให้ส่ง Object config ไปตามปกติ
// const dbConfig = config.database.url ? config.database.url : config.database;

// const pool = mysql.createPool(dbConfig);

// const db = {};

// db.query = async (query, params) => {
//   try {
//     const [rows, fields] = await pool.execute(query, params);
//     return rows;
//   } catch (e) {
//     console.error("Database Query Error:", e); // เปลี่ยน console.log เป็น console.error เพื่อให้เห็นชัดขึ้น
//     return false;
//   }
// };

// db.queryOne = async (query, params) => {
//   try {
//     const [rows] = await pool.execute(query, params);
//     return rows[0];
//   } catch (err) {
//     console.error("Database QueryOne Error:", err);
//     return false;
//   }
// };

// db.getOffset = (currentPage = 0, listPerPage) => {
//   return (+currentPage - 1) * +listPerPage;
// };

// db.insert = async (table, data) => {
//   try {
//     Object.keys(data).map((key) => {
//         if (data[key] === null) data[key] = "";
//     });
//     const columns = Object.keys(data).map(col => `\`${col}\``).join(', ');
//     const values = Object.values(data);
//     const placeholders = values.map(() => "?").join(', ');
    
//     const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
    
//     const result = await db.query(query, values);
//     return result;
//   } catch (e) {
//     console.error("Database Insert Error:", e);
//     return false;
//   }
// };

// db.update = async (table, data, condition) => {
//   try {
//     const columns = Object.keys(data).map(col => `\`${col}\` = ?`).join(', ');
//     const values = Object.values(data);
    
//     const conditions = Object.keys(condition).map(col => `\`${col}\` = ?`).join(' AND ');
//     const conditionValues = Object.values(condition);
    
//     const query = `UPDATE \`${table}\` SET ${columns} WHERE ${conditions}`;
    
//     const result = await db.query(query, [...values, ...conditionValues]);
//     return result;
//   } catch (e) {
//     console.error("Database Update Error:", e);
//     return false;
//   }
// };

// module.exports = db;

"use strict";

const { Pool } = require("pg");
const config = require("./index");

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.url.includes("localhost") 
    ? false 
    : { rejectUnauthorized: false }
});

const db = {};

// Helper Log
const logError = (msg, error, sql, params) => {
  console.error(`❌ ${msg}:`, error.message);
  if (sql) console.error("   SQL:", sql);
  if (params) console.error("   Params:", JSON.stringify(params));
};

db.query = async (text, params) => {
  try {
    // ป้องกันส่ง undefined เข้าไปใน params (เปลี่ยนเป็น null แทน)
    const safeParams = params ? params.map(p => p === undefined ? null : p) : [];
    const res = await pool.query(text, safeParams);
    return res.rows;
  } catch (e) {
    logError("Database Query Error", e, text, params);
    throw e;
  }
};

db.queryOne = async (text, params) => {
  try {
    const rows = await db.query(text, params);
    return rows[0];
  } catch (e) {
    throw e; // db.query log ให้แล้ว
  }
};

const getPlaceholders = (length, startIndex = 1) => {
  return Array.from({ length }, (_, i) => `$${i + startIndex}`).join(', ');
};

db.insert = async (table, data) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data).map(val => {
      // แปลง Object เป็น JSON String อัตโนมัติ
      if (val !== null && typeof val === 'object') return JSON.stringify(val);
      if (val === undefined) return null;
      return val;
    });
    
    const columns = keys.map(k => `"${k}"`).join(', ');
    const placeholders = getPlaceholders(values.length);

    const query = `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING *`;
    
    const result = await db.query(query, values);
    return result ? result[0] : null;
  } catch (e) {
    console.error(`❌ Insert Error [${table}]:`, e.message);
    throw e;
  }
};

db.update = async (table, data, condition) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data).map(val => {
      if (val !== null && typeof val === 'object') return JSON.stringify(val);
      if (val === undefined) return null;
      return val;
    });
    
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    
    let paramIndex = 1;
    const setClause = keys.map(k => `"${k}" = $${paramIndex++}`).join(', ');
    const whereClause = conditionKeys.map(k => `"${k}" = $${paramIndex++}`).join(' AND ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE ${whereClause} RETURNING *`;
    
    const result = await db.query(query, [...values, ...conditionValues]);
    return result;
  } catch (e) {
    console.error(`❌ Update Error [${table}]:`, e.message);
    throw e;
  }
};

module.exports = db;