const repo = require('./buses.repository');

const getBuses = async (req, res) => {
  try {
    // รับ company_id จาก Query หรือ Header
    const companyId = req.query.company_id || req.headers['x-company-id'];
    const items = await repo.findAll(companyId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBus = async (req, res) => {
  try {
    const result = await repo.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { layout_id } = req.body;
    const result = await repo.update(id, { current_layout_id: layout_id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API สำหรับกล่อง Android
const getConfigByDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const bus = await repo.findByDeviceId(device_id);
    
    if (!bus) {
      return res.status(404).json({ message: "Bus not registered" });
    }
    
    res.json({ 
      bus_id: bus.id,
      company_id: bus.company_id,
      id: bus.current_layout_id, // ส่ง ID ของ Layout กลับไป
      name: bus.layout_name,
      updated_at: bus.updated_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBuses, createBus, assignLayout, getConfigByDevice };