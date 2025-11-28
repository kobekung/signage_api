const express = require('express');
const cors = require('cors');
// [1] เพิ่ม import library ที่จำเป็น
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// --- [2] ส่วนจัดการไฟล์ Upload (แทรกตรงนี้) ---

// 2.1 สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
// (นี่คือ "Path" ที่ไฟล์จะถูกวางเก็บไว้จริงๆ ในเครื่อง Server)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2.2 เปิดให้เข้าถึงไฟล์ผ่าน URL /uploads
// (เช่น http://localhost:5000/uploads/ชื่อไฟล์.jpg)
app.use('/uploads', express.static(uploadDir));

// 2.3 ตั้งค่า Multer (ตัวจัดการอัปโหลด)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // บอกว่าจะเก็บไฟล์ที่ path นี้
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์ใหม่: timestamp-เลขสุ่ม.นามสกุลเดิม (กันชื่อซ้ำ)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 2.4 สร้าง Route สำหรับรับไฟล์จากหน้าบ้าน
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // สร้าง URL เต็มส่งกลับไปให้หน้าบ้าน
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// ---------------------------------------------

// API Routes
app.use('/api', routes);
app.get("/", (req, res) => {
  res.send("Bussing Transit Signage API is running!");
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});