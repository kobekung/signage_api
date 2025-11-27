const { v4: uuidv4 } = require('uuid');
const widgetsRepo = require('./widgets.repository');

const createWidget = async (widgetData) => {
  // เตรียมข้อมูลก่อนบันทึก (Business Logic)
  const newWidget = {
    id: uuidv4(),
    layout_id: widgetData.layout_id,
    type: widgetData.type,
    x: widgetData.x || 0,
    y: widgetData.y || 0,
    width: widgetData.width || 100,
    height: widgetData.height || 100,
    z_index: widgetData.z_index || 1,
    // แปลง properties เป็น string ก่อนลง DB
    properties: JSON.stringify(widgetData.properties || {})
  };

  await widgetsRepo.create(newWidget);
  return newWidget;
};

const getWidgetsByLayoutId = async (layoutId) => {
  const widgets = await widgetsRepo.findByLayoutId(layoutId);
  
  // แปลง properties กลับเป็น JSON object ตอนดึงออกมาใช้งาน
  return widgets.map(w => ({
    ...w,
    properties: typeof w.properties === 'string' ? JSON.parse(w.properties) : w.properties
  }));
};

module.exports = {
  createWidget,
  getWidgetsByLayoutId
};