const db = require('../models/database');

// Show all customers
exports.list = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY id');
    res.render('customers/list', { customers: result.rows });
  } catch (err) {
    res.status(500).send('Error fetching customers');
  }
};

// Show create form
exports.showCreateForm = (req, res) => {
  res.render('customers/create');
};
exports.create = async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId, 10);
    const { name, price } = req.body;

    if (!restaurantId || !name || !price) {
      return res.status(400).send('Missing required data.');
    }

    // Insert new menu item
    const menuItemResult = await db.query(
      `INSERT INTO menu_items (name, price) VALUES ($1, $2) RETURNING id`,
      [name, price]
    );
    const newMenuItemId = menuItemResult.rows[0].id;

    // Insert into the junction table
    await db.query(
      `INSERT INTO restaurant_menu (restaurant_id, menu_item_id) VALUES ($1, $2)`,
      [restaurantId, newMenuItemId]
    );

    res.redirect(`/menu/restaurant/${restaurantId}`);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).send('Server error');
  }
};

// Add a new customer
exports.create = async (req, res) => {
  const { name, email } = req.body; // use email here

  try {
    await db.query('INSERT INTO customers (name, email) VALUES ($1, $2)', [name, email]);
    res.redirect('/customers');
  } catch (err) {
    res.status(500).send('Error adding customer');
  }
};


// Show edit form
exports.showEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Customer not found');
    res.render('customers/edit', { customer: result.rows[0] });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
};

// Update customer
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;  // use email here to match your DB column

  try {
    await db.query(
      'UPDATE customers SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    );
    res.redirect('/customers');
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).send('Error updating customer');
  }
};

// Delete customer
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM customers WHERE id = $1', [id]);
    res.redirect('/customers');
  } catch (err) {
    res.status(500).send('Error deleting customer');
  }
};
