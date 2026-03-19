const express = require('express');
const router = express.Router();
const costService = require('../services/costService');

// Get dashboard data - all providers cost summary
router.get('/dashboard', async (req, res) => {
  try {
    const data = await costService.getDashboard();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get costs by provider
router.get('/providers/:provider', async (req, res) => {
  try {
    const data = await costService.getProviderCosts(req.params.provider);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget status and guardrails
router.get('/budget', async (req, res) => {
  try {
    const data = await costService.getBudgetStatus();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get alerts
router.get('/alerts', async (req, res) => {
  try {
    const data = await costService.getAlerts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get forecast
router.get('/forecast', async (req, res) => {
  try {
    const data = await costService.getForecast();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a cost entry (for testing/demo)
router.post('/costs', async (req, res) => {
  try {
    const result = await costService.addCostEntry(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;