const express = require('express');
const cors = require('cors');
const costRoutes = require('./routes/costs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/costs', costRoutes);

// Dashboard static files
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`🚀 AI Cost Control Copilot running on port ${PORT}`);
});