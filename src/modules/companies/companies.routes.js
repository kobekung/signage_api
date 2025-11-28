const express = require('express');
const router = express.Router();
const controller = require('./companies.controller');

router.get('/', controller.getCompanies);
router.post('/', controller.createCompany);

module.exports = router;