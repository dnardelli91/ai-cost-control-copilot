/**
 * Ingest module - Upload/ingest of usage logs (mock CSV/JSON)
 */

const fs = require('fs');
const path = require('path');

// Mock data generator for MVP
function generateMockLogs(count = 50) {
  const providers = ['OpenAI', 'Anthropic', 'Google', 'Azure', 'AWS'];
  const models = {
    'OpenAI': ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    'Anthropic': ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    'Google': ['gemini-pro', 'gemini-flash'],
    'Azure': ['gpt-4', 'gpt-35-turbo'],
    'AWS': ['claude-3-sonnet', 'titan-text']
  };
  const projects = ['marketing-bot', 'customer-support', 'code-assistant', 'data-pipeline', 'analytics'];

  const logs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const model = models[provider][Math.floor(Math.random() * models[provider].length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    
    // Cost per 1K tokens (mock rates)
    const inputRate = { 'gpt-4o': 2.50, 'gpt-4o-mini': 0.15, 'gpt-4-turbo': 10.00, 
                        'claude-3-opus': 15.00, 'claude-3-sonnet': 3.00, 'claude-3-haiku': 0.25,
                        'gemini-pro': 1.25, 'gemini-flash': 0.075, 'gpt-4': 32.00, 'gpt-35-turbo': 0.50 }[model] || 1.00;
    const outputRate = inputRate * 1.5;
    
    const inputTokens = Math.floor(Math.random() * 100000) + 1000;
    const outputTokens = Math.floor(Math.random() * 30000) + 100;
    const cost = ((inputTokens + outputTokens) / 1000) * inputRate;

    logs.push({
      timestamp: date.toISOString(),
      provider,
      model,
      project,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      cost: Math.round(cost * 100) / 100
    });
  }

  return logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

async function ingestLogs(filePath = null) {
  // If file provided, would parse CSV/JSON here
  // For MVP, generate mock data
  if (!filePath) {
    return generateMockLogs(50);
  }

  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf-8');

  if (ext === '.json') {
    return JSON.parse(content);
  } else if (ext === '.csv') {
    // Simple CSV parser
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
      obj.inputTokens = parseInt(obj.inputTokens);
      obj.outputTokens = parseInt(obj.outputTokens);
      obj.cost = parseFloat(obj.cost);
      return obj;
    });
  }

  throw new Error('Unsupported file format');
}

module.exports = { ingestLogs, generateMockLogs };
