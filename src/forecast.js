/**
 * Forecast module - Simple cost forecasting
 */

function forecastCosts(usageData, days = 30) {
  // Group by day and calculate daily costs
  const dailyCosts = {};
  usageData.forEach(record => {
    const date = record.timestamp.split('T')[0];
    dailyCosts[date] = (dailyCosts[date] || 0) + record.cost;
  });

  const costs = Object.values(dailyCosts);
  if (costs.length === 0) {
    return { projected: 0, trend: 'stable' };
  }

  // Simple linear regression for trend
  const n = costs.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = costs.reduce((a, b) => a + b, 0);
  const sumXY = costs.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const avgDaily = sumY / n;

  // Project next 'days'
  const projected = avgDaily * days + slope * (n * days);
  const projectedAdjusted = Math.max(0, projected);

  // Determine trend
  const slopePercent = (slope / avgDaily) * 100;
  let trend = 'stable';
  if (slopePercent > 5) trend = 'increasing';
  else if (slopePercent < -5) trend = 'decreasing';

  return {
    projected: Math.round(projectedAdjusted * 100) / 100,
    trend,
    avgDaily: Math.round(avgDaily * 100) / 100,
    dailyChange: Math.round(slope * 100) / 100
  };
}

module.exports = { forecastCosts };
