# AI Cost Control Copilot

Dashboard/operator copilot for multi-provider AI cost control.

## Features (MVP)

- **Ingest**: Upload/ingest usage logs (CSV/JSON) or use mock data
- **Overview**: Cost breakdown by provider, model, and project
- **Alerts**: Anomaly and overspend detection
- **Forecast**: Simple 30-day cost projection
- **Recommendations**: Model routing suggestions

## Quick Start

```bash
npm install
npm start
```

## Project Structure

```
src/
  index.js          - Entry point
  ingest.js         - Log ingestion (mock or file)
  analytics.js      - Cost overview
  alerts.js         - Anomaly/overspend detection
  forecast.js       - Cost forecasting
  recommendations.js - Model routing suggestions
data/               - Sample data
```

## Usage

Run with mock data:
```bash
npm start
```

Ingest from file:
```bash
node src/index.js path/to/logs.csv
```

## Tech Stack

- Node.js (pure - no frameworks for MVP speed)

---

*MVP built for innovation cycle - v0.1.0*
