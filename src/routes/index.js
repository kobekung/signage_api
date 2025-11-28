const express = require('express');
const router = express.Router();

const layoutRoutes = require('../modules/layouts/layouts.routes');
const widgetRoutes = require('../modules/widgets/widgets.routes');
const companyRoutes = require('../modules/companies/companies.routes'); // [NEW]
const busRoutes = require('../modules/buses/buses.routes'); // [NEW]

router.use('/layouts', layoutRoutes);
router.use('/widgets', widgetRoutes);
router.use('/companies', companyRoutes); // [NEW]
router.use('/buses', busRoutes); // [NEW]

module.exports = router;