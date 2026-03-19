# AI Cost Control Copilot

MVP per il monitoraggio e controllo dei costi LLM multi-provider.

## Features

- 📊 **Dashboard** - Visualizzazione costi per provider
- 💰 **Budget Guardrails** - Soglie di alert (80%) e critical (95%)
- 🔔 **Alerting** - Notifiche per superamento budget
- 📈 **Forecast** - Proiezione costi mensile

## Stack

- Node.js + Express
- Vanilla JS frontend
- REST API

## Quick Start

```bash
cd ai-cost-control-copilot
npm install
npm start
```

Apri http://localhost:3000

## API Endpoints

- `GET /api/costs/dashboard` - Riepilogo costi
- `GET /api/costs/budget` - Stato budget
- `GET /api/costs/alerts` - Alert attivi
- `GET /api/costs/forecast` - Previsioni

## Roadmap

- [ ] Database (PostgreSQL/MongoDB)
- [ ] Integrazione API provider reali
- [ ] Grafico storico
- [ ] Notifiche email/Slack
- [ ] Autenticazione