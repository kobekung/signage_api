
require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-super-secret-key',
    expiresIn: '1d', // ตัวอย่างการตั้งค่าเพิ่มเติม
  },
  // เพิ่ม config อื่นๆ ที่นี่
  //เช่น corsOptions: {
  //   origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  // }
};

module.exports = config;