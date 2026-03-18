/**
 * Recommendations module - Model routing suggestions
 */

function getRecommendations(usageData, overview) {
  const recommendations = [];

  // Analyze provider usage
  const providerCosts = overview.byProvider;
  const totalCost = overview.totalCost;

  // Check if any provider dominates spend
  Object.entries(providerCosts).forEach(([provider, cost]) => {
    const pct = (cost / totalCost) * 100;
    if (pct > 60) {
      recommendations.push(
        `Consider diversifying from ${provider} (${pct.toFixed(1)}% of spend). Try Claude-3-Haiku or GPT-4o-mini for simpler tasks.`
      );
    }
  });

  // Check high-cost models
  const modelCosts = overview.byModel;
  Object.entries(modelCosts).forEach(([model, cost]) => {
    if (cost > totalCost * 0.3 && (model.includes('opus') || model.includes('gpt-4'))) {
      recommendations.push(
        `${model} accounts for $${cost.toFixed(2)} (${((cost/totalCost)*100).toFixed(1)}%). Use smaller models for non-complex tasks.`
      );
    }
  });

  // Check project efficiency
  const projectCosts = overview.byProject;
  const projectCounts = {};
  usageData.forEach(r => {
    projectCounts[r.project] = (projectCounts[r.project] || 0) + 1;
  });

  Object.entries(projectCosts).forEach(([project, cost]) => {
    const avgCost = cost / (projectCounts[project] || 1);
    if (avgCost > 10) {
      recommendations.push(
        `${project} has high avg cost per call ($${avgCost.toFixed(2)}). Review prompts for optimization.`
      );
    }
  });

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('Cost distribution looks healthy. Continue monitoring.');
  }

  recommendations.push('Enable caching for repeated queries to reduce costs by up to 80%.');

  return recommendations;
}

module.exports = { getRecommendations };
