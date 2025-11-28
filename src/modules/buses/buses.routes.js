const express = require('express');
const router = express.Router();
const controller = require('./buses.controller');

router.get('/', controller.getBuses);
router.post('/', controller.createBus);
router.put('/:id/assign', controller.assignLayout);
router.get('/device/:device_id', controller.getConfigByDevice); // เส้นนี้สำหรับ Android

module.exports = router;