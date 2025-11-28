const repo = require('./companies.repository');

const getCompanies = async (req, res) => {
  const items = await repo.findAll();
  res.json(items);
};

const createCompany = async (req, res) => {
  const result = await repo.create(req.body);
  res.json(result);
};

module.exports = { getCompanies, createCompany };