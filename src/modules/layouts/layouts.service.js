const { v4: uuidv4 } = require('uuid');
const layoutsRepo = require('./layouts.repository');
const widgetsService = require('../widgets/widgets.service');
const widgetsRepo = require('../widgets/widgets.repository');

const getAllLayouts = async () => {
  return await layoutsRepo.findAll();
};

const getLayoutById = async (id) => {
  const layout = await layoutsRepo.findById(id);
  if (!layout) return null;

  // ดึง Widgets ที่เกี่ยวข้องมาด้วย
  const widgets = await widgetsService.getWidgetsByLayoutId(id);
  return { ...layout, widgets };
};

const createLayout = async (data) => {
  const { name, width, height, background_color, widgets } = data;
  const layoutId = uuidv4();

  // 1. บันทึก Layout ลงฐานข้อมูล
  await layoutsRepo.create({
    id: layoutId,
    name,
    width: width || 1920,
    height: height || 1080,
    background_color: background_color || '#ffffff',
    created_at: new Date(),
    updated_at: new Date()
  });

  // 2. บันทึก Widgets (ถ้ามี)
  if (widgets && widgets.length > 0) {
    for (const w of widgets) {
      await widgetsService.createWidget({
        ...w,
        layout_id: layoutId // ผูก ID ของ layout ที่เพิ่งสร้าง
      });
    }
  }

  return { id: layoutId, message: "Layout created successfully" };
};

const updateLayout = async (id, data) => {
  const { name, width, height, background_color, widgets } = data;

  // 1. อัปเดตข้อมูล Layout
  await layoutsRepo.update(id, {
    name,
    width,
    height,
    background_color,
    updated_at: new Date()
  });

  // 2. ลบ Widgets เก่าทิ้งทั้งหมด (Reset)
  await widgetsRepo.deleteByLayoutId(id);

  // 3. ลง Widgets ชุดใหม่ที่ส่งมาจากหน้าบ้าน
  if (widgets && widgets.length > 0) {
    for (const w of widgets) {
      await widgetsService.createWidget({
        ...w,
        layout_id: id
      });
    }
  }

  return { id, message: "Layout updated successfully" };
};

const deleteLayout = async (id) => {
  await widgetsRepo.deleteByLayoutId(id);
  await layoutsRepo.deleteById(id);
};

module.exports = {
  getAllLayouts,
  getLayoutById,
  createLayout,
  updateLayout,
  deleteLayout
};