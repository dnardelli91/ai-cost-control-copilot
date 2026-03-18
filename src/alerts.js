/**
 * Alerts module - Anomaly/overspend detection
 */

function checkAlerts(usageData, options = {}) {
  const { threshold = 100, anomalyMultiplier = 2 } = options;
  const alerts = [];

  // Group by day
  const dailyCosts = {};
  usageData.forEach(record => {
    const date = record.timestamp.split('T')[0];
    dailyCosts[date] = (dailyCosts[date] || 0) + record.cost;
  });

  const costs = Object.values(dailyCosts);
  const avgDaily = costs.reduce((a, b) => a + b, 0) / costs.length;

  // Check overspend alerts (daily cost > threshold)
  Object.entries(dailyCosts).forEach(([date, cost]) => {
    if (cost > threshold) {
      alerts.push({
        severity: 'HIGH',
        type: 'overspend',
        message: `Daily overspend on ${date}: $${cost.toFixed(2)} (threshold: $${threshold})`
      });
    }
  });

  // Check anomaly (cost > 2x average)
  Object.entries(dailyCosts).forEach(([date, cost]) => {
    if (cost > avgDaily * anomalyMultiplier && cost <= threshold) {
      alerts.push({
        severity: 'MEDIUM',
        type: 'anomaly',
        message: `Anomalous spend on ${date}: $${cost.toFixed(2)} (avg: $${avgDaily.toFixed(2)})`
      });
    }
  });

  // Check by provider for spikes
  const providerDaily = {};
  usageData.forEach(record => {
    const date = record.timestamp.split('T')[0];
    const key = `${record.provider}-${date}`;
    providerDaily[key] = (providerDaily[key] || 0) + record.cost;
  });

  Object.entries(providerDaily).forEach(([key, cost]) => {
    if (cost > threshold * 0.5) {
      const [provider, date] = key.split('-');
      alerts.push({
        severity: 'LOW',
        type: 'provider-spike',
        message: `${provider} high usage on ${date}: $${cost.toFixed(2)}`
      });
    }
  });

  return alerts;
}

module.exports = { checkAlerts };
