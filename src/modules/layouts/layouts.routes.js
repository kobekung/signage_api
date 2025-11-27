const express = require('express');
const router = express.Router();
const controller = require('./layouts.controller');

router.get('/', controller.getLayouts);
router.get('/:id', controller.getLayoutById);
router.post('/', controller.createLayout);

// [เพิ่ม] เส้นทาง Update และ Delete
router.put('/:id', controller.updateLayout);   // สำหรับ Save
router.delete('/:id', controller.deleteLayout); // สำหรับ Delete

module.exports = router;