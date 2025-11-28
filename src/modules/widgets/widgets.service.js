// ลบ const { v4: uuidv4 } = require('uuid'); ออก
const widgetsRepo = require('./widgets.repository');

const createWidget = async (widgetData) => {
  const newWidget = {
    // [FIX] ไม่ต้อง gen id
    layout_id: widgetData.layout_id,
    type: widgetData.type,
    x: Math.round(widgetData.x || 0),
    y: Math.round(widgetData.y || 0),
    width: Math.round(widgetData.width || 100),
    height: Math.round(widgetData.height || 100),
    z_index: widgetData.z_index || 1,
    properties: widgetData.properties || {} 
  };

  return await widgetsRepo.create(newWidget);
};

const getWidgetsByLayoutId = async (layoutId) => {
  const widgets = await widgetsRepo.findByLayoutId(layoutId);
  return widgets.map(w => ({
    ...w,
    properties: typeof w.properties === 'string' ? JSON.parse(w.properties) : w.properties
  }));
};

module.exports = { createWidget, getWidgetsByLayoutId };