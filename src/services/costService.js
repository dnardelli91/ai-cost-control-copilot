/**
 * Cost Service - Core business logic for AI Cost Control Copilot
 * Handles: dashboard data, budget guardrails, alerts, forecasting
 */

const providers = ['openai', 'anthropic', 'google', 'azure', 'cohere'];

// Demo data - in production, this would come from database/API
const costData = {
  currentMonth: {
    openai: { tokens: 2450000, cost: 127.50 },
    anthropic: { tokens: 1820000, cost: 91.00 },
    google: { tokens: 3100000, cost: 62.00 },
    azure: { tokens: 950000, cost: 38.00 },
    cohere: { tokens: 450000, cost: 18.00 }
  },
  history: [
    { month: '2025-10', total: 245.00 },
    { month: '2025-11', total: 312.00 },
    { month: '2025-12', total: 298.00 },
    { month: '2026-01', total: 356.00 },
    { month: '2026-02', total: 389.00 }
  ]
};

// Budget configuration
const budgetConfig = {
  monthlyLimit: 500.00,
  alertThreshold: 0.80, // 80% of budget
  criticalThreshold: 0.95 // 95% of budget
};

class CostService {
  
  /**
   * Get dashboard summary - all providers cost breakdown
   */
  async getDashboard() {
    const current = costData.currentMonth;
    const totalCost = Object.values(current).reduce((sum, p) => sum + p.cost, 0);
    const totalTokens = Object.values(current).reduce((sum, p) => sum + p.tokens, 0);
    
    const providersData = Object.entries(current).map(([name, data]) => ({
      name,
      tokens: data.tokens,
      cost: data.cost,
      percentage: ((data.cost / totalCost) * 100).toFixed(1)
    }));
    
    return {
      summary: {
        totalCost: totalCost.toFixed(2),
        totalTokens,
        budgetUsed: ((totalCost / budgetConfig.monthlyLimit) * 100).toFixed(1),
        budgetRemaining: (budgetConfig.monthlyLimit - totalCost).toFixed(2)
      },
      providers: providersData.sort((a, b) => b.cost - a.cost)
    };
  }
  
  /**
   * Get costs for specific provider
   */
  async getProviderCosts(provider) {
    const data = costData.currentMonth[provider.toLowerCase()];
    if (!data) {
      throw new Error(`Provider '${provider}' not found`);
    }
    return { provider, ...data };
  }
  
  /**
   * Get budget status with guardrails
   */
  async getBudgetStatus() {
    const current = costData.currentMonth;
    const totalCost = Object.values(current).reduce((sum, p) => sum + p.cost, 0);
    const percentage = (totalCost / budgetConfig.monthlyLimit);
    
    const status = percentage >= budgetConfig.criticalThreshold 
      ? 'critical' 
      : percentage >= budgetConfig.alertThreshold 
        ? 'warning' 
        : 'ok';
    
    return {
      limit: budgetConfig.monthlyLimit,
      spent: totalCost.toFixed(2),
      remaining: (budgetConfig.monthlyLimit - totalCost).toFixed(2),
      percentage: (percentage * 100).toFixed(1),
      status,
      guardrails: {
        alertAt: (budgetConfig.monthlyLimit * budgetConfig.alertThreshold).toFixed(2),
        criticalAt: (budgetConfig.monthlyLimit * budgetConfig.criticalThreshold).toFixed(2)
      }
    };
  }
  
  /**
   * Get active alerts
   */
  async getAlerts() {
    const budgetStatus = await this.getBudgetStatus();
    const alerts = [];
    
    // Budget alerts
    if (budgetStatus.status === 'critical') {
      alerts.push({
        id: 'budget-critical',
        type: 'budget',
        severity: 'critical',
        message: `Budget critical: ${budgetStatus.percentage}% used ($${budgetStatus.spent}/${budgetStatus.limit})`
      });
    } else if (budgetStatus.status === 'warning') {
      alerts.push({
        id: 'budget-warning',
        type: 'budget',
        severity: 'warning',
        message: `Budget warning: ${budgetStatus.percentage}% used`
      });
    }
    
    // Provider-specific alerts (high cost)
    const dashboard = await this.getDashboard();
    dashboard.providers.forEach(p => {
      if (parseFloat(p.percentage) > 35) {
        alerts.push({
          id: `provider-high-${p.name}`,
          type: 'usage',
          severity: 'info',
          message: `High usage: ${p.name} at ${p.percentage}% of total cost`
        });
      }
    });
    
    return alerts;
  }
  
  /**
   * Simple forecast - linear projection based on last 3 months
   */
  async getForecast() {
    const history = costData.history.slice(-3);
    const avgMonthly = history.reduce((sum, h) => sum + h.total, 0) / history.length;
    const trend = (history[2].total - history[0].total) / 2;
    
    const nextMonth = history[2].total + trend;
    
    return {
      currentMonthly: history[2].total.toFixed(2),
      forecastNextMonth: nextMonth.toFixed(2),
      forecastEndOfQuarter: (nextMonth * 3).toFixed(2),
      trend: trend > 0 ? 'increasing' : 'decreasing',
      trendPercentage: Math.abs((trend / history[2].total) * 100).toFixed(1),
      confidence: 'medium'
    };
  }
  
  /**
   * Add cost entry (for demo/testing)
   */
  async addCostEntry(entry) {
    const { provider, tokens, cost } = entry;
    if (!provider || tokens === undefined || cost === undefined) {
      throw new Error('Missing required fields: provider, tokens, cost');
    }
    
    // In production, save to database
    return { success: true, entry: { provider, tokens, cost, date: new Date() } };
  }
}

module.exports = new CostService();