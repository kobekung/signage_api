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

// สร้าง Connection Pool ของ PostgreSQL
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.url.includes("localhost") 
    ? false 
    : { rejectUnauthorized: false }
});

const db = {};

// ฟังก์ชัน Query ทั่วไป
db.query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (e) {
    console.error("❌ Database Query Error:", e.message);
    console.error("   SQL:", text);
    console.error("   Params:", params);
    throw e; // ส่ง Error ต่อไปเพื่อให้ Controller รู้ว่าพัง
  }
};

// ฟังก์ชันดึงข้อมูลแถวเดียว
db.queryOne = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res.rows[0];
  } catch (e) {
    console.error("❌ Database QueryOne Error:", e.message);
    throw e;
  }
};

// [สำคัญ] Helper สร้างตัวแปร $1, $2, $3 ... สำหรับ Postgres
const getPlaceholders = (length, startIndex = 1) => {
  return Array.from({ length }, (_, i) => `$${i + startIndex}`).join(', ');
};

db.insert = async (table, data) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data).map(val => (val === undefined ? null : val));
    
    // ใช้ Double Quotes "" สำหรับชื่อ Column ใน Postgres
    const columns = keys.map(k => `"${k}"`).join(', ');
    // สร้าง Placeholder $1, $2, $3 ...
    const placeholders = getPlaceholders(values.length);

    // RETURNING * เพื่อให้ได้ข้อมูลที่เพิ่ง Insert กลับมาทันที
    const query = `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING *`;
    
    const result = await db.query(query, values);
    return result ? result[0] : null;
  } catch (e) {
    console.error(`❌ Database Insert Error [${table}]:`, e.message);
    throw e;
  }
};

db.update = async (table, data, condition) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    
    let paramIndex = 1;
    
    // สร้าง Set Clause: "col1" = $1, "col2" = $2
    const setClause = keys.map(k => `"${k}" = $${paramIndex++}`).join(', ');
    
    // สร้าง Where Clause: "id" = $3
    const whereClause = conditionKeys.map(k => `"${k}" = $${paramIndex++}`).join(' AND ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE ${whereClause} RETURNING *`;
    
    const result = await db.query(query, [...values, ...conditionValues]);
    return result;
  } catch (e) {
    console.error(`❌ Database Update Error [${table}]:`, e.message);
    throw e;
  }
};

module.exports = db;