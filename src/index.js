/**
 * AI Cost Control Copilot - Entry Point
 * Dashboard/operator copilot for multi-provider AI cost control
 */

const { ingestLogs } = require('./ingest');
const { getCostOverview } = require('./analytics');
const { checkAlerts } = require('./alerts');
const { forecastCosts } = require('./forecast');
const { getRecommendations } = require('./recommendations');

async function main() {
  console.log('🤖 AI Cost Control Copilot v0.1.0\n');

  // 1. Ingest mock usage logs
  console.log('📥 Ingesting usage logs...');
  const usageData = await ingestLogs();
  console.log(`   Loaded ${usageData.length} records\n`);

  // 2. Cost overview by provider/model/project
  console.log('📊 Cost Overview:');
  const overview = getCostOverview(usageData);
  console.log(`   Total Cost: $${overview.totalCost.toFixed(2)}`);
  console.log(`   By Provider:`, overview.byProvider);
  console.log(`   By Model:`, overview.byModel);
  console.log(`   By Project:`, overview.byProject);
  console.log('');

  // 3. Check for anomalies/overspend
  console.log('🔔 Alerts:');
  const alerts = checkAlerts(usageData, { threshold: 100 });
  alerts.forEach(a => console.log(`   [${a.severity}] ${a.message}`));
  console.log('');

  // 4. Simple forecast
  console.log('🔮 Forecast (next 30 days):');
  const forecast = forecastCosts(usageData, 30);
  console.log(`   Projected: $${forecast.projected.toFixed(2)}`);
  console.log(`   Trend: ${forecast.trend}`);
  console.log('');

  // 5. Recommendations stub
  console.log('💡 Recommendations:');
  const recommendations = getRecommendations(usageData, overview);
  recommendations.forEach(r => console.log(`   • ${r}`));
  console.log('');

  console.log('✅ Dashboard generation complete');
}

main().catch(console.error);
