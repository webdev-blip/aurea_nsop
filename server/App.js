require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const aircraftRoutes = require('./routes/aircraft.routes');
const aircraftmodelsRoutes = require('./routes/aircraftmodels.routes');
const manufacturersRoutes = require('./routes/manufacturers.routes.js');
const primarymodelRoutes = require('./routes/primarymodel.routes.js');
const periodsRoutes = require('./routes/periods.routes.js');
const cityRoutes = require('./routes/city.routes.js')
const placeRoutes = require('./routes/place.routes.js')
const vendorRoutes = require('./routes/vendor.routes.js')
const ataRoutes = require('./routes/ata.routes.js')
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base route
app.get('/', (req, res) => res.send('✈️ Aircraft API is running...'));

// Aircraft routes
app.use('/api/aircraft', aircraftRoutes);

// Model routes
app.use('/api/aircraftmodels',aircraftmodelsRoutes);
app.use('/api/manufacturers',manufacturersRoutes);
app.use('/api/primarymodel',primarymodelRoutes);
app.use('/api/periods',periodsRoutes);
app.use('/api/city',cityRoutes);
app.use('/api/places',placeRoutes);
app.use('/api/vendor',vendorRoutes);
app.use('/api/ata',ataRoutes);

// city

// Sync DB & Start server
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced successfully');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
