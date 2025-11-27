const express = require('express');
const router = express.Router();

const layoutRoutes = require('../modules/layouts/layouts.routes');
const widgetRoutes = require('../modules/widgets/widgets.routes'); // ✅ เพิ่มบรรทัดนี้

router.use('/layouts', layoutRoutes);
router.use('/widgets', widgetRoutes); // ✅ เพิ่มบรรทัดนี้

module.exports = router;