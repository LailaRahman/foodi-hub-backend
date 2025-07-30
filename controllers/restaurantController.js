const db = require('../models/database');

// List all restaurants
exports.list = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM restaurants');
    res.render('restaurants/list', { restaurants: result.rows });
  } catch (error) {
    next(error);
  }
};

// Show form to create a new restaurant
exports.createForm = (req, res) => res.render('restaurants/create');

// Create a new restaurant
exports.create = async (req, res) => {
  const { name, address } = req.body;  
  try {
    await db.query(
      'INSERT INTO restaurants (name, address) VALUES ($1, $2)',
      [name, address]
    );
    res.redirect('/restaurants');
  } catch (err) {
    console.error('Error inserting restaurant:', err);
    res.status(500).send('Insert failed');
  }
};

// Show form to edit a restaurant
exports.editForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    res.render('restaurants/edit', { restaurant: result.rows[0] });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Error loading edit form');
  }
};

// Update restaurant details
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;  
  try {
    await db.query(
      'UPDATE restaurants SET name = $1, address = $2 WHERE id = $3', 
      [name, address, id]
    );
    res.redirect('/restaurants');
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(500).send('Update failed');
  }
};

// Delete a restaurant
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM restaurants WHERE id = $1', [id]);
    res.redirect('/restaurants');
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    res.status(500).send('Delete failed');
  }
};
