const db = require('./models/database');

db.query('SELECT NOW()')
  .then(res => console.log('Database connected:', res.rows[0].now))
  .catch(err => console.error('Database connection error:', err));

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const restaurants = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const customers = require('./routes/customers');
const orders = require('./routes/orders');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(methodOverride('_method'));
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));  
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => res.render('index'));
app.use('/restaurants', restaurants);
app.use('/menu', menuRoutes);
app.use('/customers', customers);
app.use('/orders', orders);

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack || err);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
