// ลบ const { v4: uuidv4 } = require('uuid'); ออก
const layoutsRepo = require('./layouts.repository');
const widgetsService = require('../widgets/widgets.service');
const widgetsRepo = require('../widgets/widgets.repository');

const getAllLayouts = async (companyId) => {
  return await layoutsRepo.findAll(companyId);
};

const getLayoutById = async (id) => {
  const layout = await layoutsRepo.findById(id);
  if (!layout) return null;
  const widgets = await widgetsService.getWidgetsByLayoutId(id);
  return { ...layout, widgets };
};

const createLayout = async (data) => {
  const { name, width, height, background_color, widgets } = data;
  
  // [FIX] ไม่ต้อง gen ID เองแล้ว
  const newLayout = await layoutsRepo.create({
    company_id: company_id,
    name,
    width: width || 1920,
    height: height || 1080,
    background_color: background_color || '#ffffff',
    created_at: new Date(),
    updated_at: new Date()
  });

  const layoutId = newLayout.id; // เอา ID จริงที่ได้จาก DB มาใช้

  if (widgets && widgets.length > 0) {
    for (const w of widgets) {
      await widgetsService.createWidget({
        ...w,
        layout_id: layoutId
      });
    }
  }

  return { id: layoutId, message: "Layout created successfully" };
};

const updateLayout = async (id, data) => {
    // ... โค้ดเดิม (update ใช้ id เดิมได้เลย ไม่กระทบ)
    const { name, width, height, background_color, widgets } = data;
    await layoutsRepo.update(id, {
        name, width, height, background_color, updated_at: new Date()
    });
    
    await widgetsRepo.deleteByLayoutId(id);
    
    if (widgets && widgets.length > 0) {
        for (const w of widgets) {
            await widgetsService.createWidget({ ...w, layout_id: id });
        }
    }
    return { id, message: "Layout updated successfully" };
};

const deleteLayout = async (id) => {
    await widgetsRepo.deleteByLayoutId(id);
    await layoutsRepo.deleteById(id);
};

module.exports = { getAllLayouts, getLayoutById, createLayout, updateLayout, deleteLayout };