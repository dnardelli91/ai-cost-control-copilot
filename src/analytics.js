/**
 * Analytics module - Cost overview by provider/model/project
 */

function getCostOverview(usageData) {
  const overview = {
    totalCost: 0,
    byProvider: {},
    byModel: {},
    byProject: {}
  };

  usageData.forEach(record => {
    overview.totalCost += record.cost;

    // By Provider
    overview.byProvider[record.provider] = (overview.byProvider[record.provider] || 0) + record.cost;

    // By Model
    overview.byModel[record.model] = (overview.byModel[record.model] || 0) + record.cost;

    // By Project
    overview.byProject[record.project] = (overview.byProject[record.project] || 0) + record.cost;
  });

  // Round values
  overview.totalCost = Math.round(overview.totalCost * 100) / 100;
  Object.keys(overview.byProvider).forEach(k => overview.byProvider[k] = Math.round(overview.byProvider[k] * 100) / 100);
  Object.keys(overview.byModel).forEach(k => overview.byModel[k] = Math.round(overview.byModel[k] * 100) / 100);
  Object.keys(overview.byProject).forEach(k => overview.byProject[k] = Math.round(overview.byProject[k] * 100) / 100);

  return overview;
}

module.exports = { getCostOverview };
