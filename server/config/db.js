const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config.json')['development'];

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ✅ Database Connection (Sequelize)
const db = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

// ✅ Test connection
db.authenticate()
  .then(() => console.log('✅ Connected to MySQL database'))
  .catch(err => console.error('❌ Database connection failed:', err));

// ✅ Step 4: Create API Routes
app.get('/', (req, res) => {
  res.send('API is running successfully 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
