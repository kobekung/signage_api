const express = require('express');
const router = express.Router();
const controller = require('./widgets.controller');

router.post('/', controller.createWidget);

module.exports = router;