const { v4: uuidv4 } = require('uuid');
const layoutsRepo = require('./layouts.repository');
const widgetsService = require('../widgets/widgets.service'); // ✅ เรียก Service แทน Repo
const widgetsRepo = require('../widgets/widgets.repository');

const getAllLayouts = async () => {
  return await layoutsRepo.findAll();
};

const getLayoutById = async (id) => {
  const layout = await layoutsRepo.findById(id);
  if (!layout) return null;

  // ✅ ให้ Widget Service จัดการเรื่องดึงและแปลงข้อมูล
  const widgets = await widgetsService.getWidgetsByLayoutId(id);

  return { ...layout, widgets };
};

const createLayout = async (data) => {
  const { name, width, height, widgets } = data;
  const layoutId = uuidv4();

  // 1. สร้าง Layout
  await layoutsRepo.create({
    id: layoutId,
    name,
    width: width || 1920,
    height: height || 1080,
    // background_color: background_color || '#ffffff', // [เพิ่มบรรทัดนี้]
    created_at: new Date(),
    updated_at: new Date()
  });

  // 2. สร้าง Widgets ผ่าน Service
  if (widgets && widgets.length > 0) {
    for (const w of widgets) {
      await widgetsService.createWidget({
        ...w,
        layout_id: layoutId // ส่ง layout_id เข้าไปแปะ
      });
    }
  }

  return { id: layoutId, message: "Layout created successfully" };
};
const updateLayout = async (id, data) => {
  const { name, width, height, background_color, widgets } = data;

  // 1. อัปเดตข้อมูล Layout หลัก
  await layoutsRepo.update(id, {
    name,
    width,
    height,
    background_color,
    updated_at: new Date()
  });

  // 2. จัดการ Widgets (ลบของเก่าแล้วลงใหม่ ง่ายสุดสำหรับเคสนี้)
  // หรือถ้าจะทำให้ดีกว่านี้คือเช็คว่าอันไหนมีอยู่แล้วให้อัปเดต อันไหนไม่มีให้เพิ่ม
  
  // ลบ widgets เก่าทั้งหมดของ layout นี้ทิ้งก่อน
  await widgetsRepo.deleteByLayoutId(id); 

  // ลง widgets ใหม่
  if (widgets && widgets.length > 0) {
    for (const w of widgets) {
      await widgetsService.createWidget({
        ...w,
        layout_id: id // อย่าลืมใส่ layout_id
      });
    }
  }

  return { id, message: "Layout updated successfully" };
};

// [เพิ่ม] Delete Layout Logic
const deleteLayout = async (id) => {
  // ลบ Layout (Cascade delete ใน DB จะลบ widgets ให้เองถ้าตั้งไว้ แต่ถ้าไม่ได้ตั้งก็ควรลบ widgets ก่อน)
  // สมมติว่า DB ตั้ง Cascade ไว้ หรือไม่ก็สั่งลบ widgets ก่อนเพื่อความชัวร์
  await widgetsRepo.deleteByLayoutId(id);
  await layoutsRepo.deleteById(id);
};

module.exports = {
  getAllLayouts,
  getLayoutById,
  createLayout,
  updateLayout, // export เพิ่ม
  deleteLayout  // export เพิ่ม
};