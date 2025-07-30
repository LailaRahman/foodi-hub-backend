const db = require('../models/database');

// controllers/menuController.js

exports.listByRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  try {
    const result = await db.query(
      `SELECT m.*, r.name AS restaurant_name
       FROM menu_items m
       JOIN restaurant_menu rm ON m.id = rm.menu_item_id
       JOIN restaurants r ON rm.restaurant_id = r.id
       WHERE rm.restaurant_id = $1
       ORDER BY m.id`,
      [restaurantId]
    );

    res.render('menu/list', {
      items: result.rows,
      restaurantId,
      restaurantName: result.rows[0]?.restaurant_name || 'Restaurant'
    });
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Show create form
exports.showCreateForm = (req, res) => {
  const { restaurantId } = req.params;
  res.render('menu/create', { restaurantId });
};

// Create a menu item
exports.create = async (req, res) => {
  try {
    const { restaurantId } = req.params;   // From URL: /restaurant/:restaurantId/new
    const { name, price } = req.body;      // From form submission

    if (!name || !price) {
      return res.status(400).send('Name and price are required');
    }

    // Insert new menu item and return its id
    const menuItemResult = await db.query(
      `INSERT INTO menu_items (name, price, is_available) VALUES ($1, $2, true) RETURNING id`,
      [name, price]
    );

    const newMenuItemId = menuItemResult.rows[0].id;

    // Link menu item with restaurant in join table
    await db.query(
      `INSERT INTO restaurant_menu (restaurant_id, menu_item_id) VALUES ($1, $2)`,
      [restaurantId, newMenuItemId]
    );

    // Redirect to restaurant's menu page
    res.redirect(`/menu/restaurant/${restaurantId}`);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).send('Server error');
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const { id } = req.params;

  try {
    // Get menu item data
    const itemResult = await db.query(`SELECT * FROM menu_items WHERE id = $1`, [id]);
    if (itemResult.rows.length === 0) {
      return res.status(404).send('Menu item not found');
    }

    const item = itemResult.rows[0];

    // Get the linked restaurant_id
    const restaurantResult = await db.query(
      `SELECT restaurant_id FROM restaurant_menu WHERE menu_item_id = $1 LIMIT 1`,
      [id]
    );

    const restaurantId = restaurantResult.rows[0]?.restaurant_id;

    res.render('menu/edit', {
      item: {
        ...item,
        restaurant_id: restaurantId
      }
    });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Error loading edit form');
  }
};

// Update menu item
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    await db.query(
      `UPDATE menu_items SET name = $1, price = $2 WHERE id = $3`,
      [name, price, id]
    );

    // Find the restaurant linked via restaurant_menu
    const r = await db.query(
      `SELECT restaurant_id FROM restaurant_menu WHERE menu_item_id = $1 LIMIT 1`,
      [id]
    );

    res.redirect(`/menu/restaurant/${r.rows[0].restaurant_id}`);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).send('Error updating menu item');
  }
};

// Delete menu item
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const r = await db.query(
      `SELECT restaurant_id FROM restaurant_menu WHERE menu_item_id = $1 LIMIT 1`,
      [id]
    );
    if (r.rows.length === 0) return res.status(404).send('Menu item not found');

    // Delete from restaurant_menu first
    await db.query(
      `DELETE FROM restaurant_menu WHERE menu_item_id = $1`,
      [id]
    );

    await db.query(
      `DELETE FROM menu_items WHERE id = $1`,
      [id]
    );

    res.redirect(`/menu/restaurant/${r.rows[0].restaurant_id}`);
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).send('Error deleting menu item');
  }
};

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT is_available FROM menu_items WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Menu item not found');
    }

    const currentStatus = result.rows[0].is_available;
    const newStatus = !currentStatus;

    await db.query(
      `UPDATE menu_items SET is_available = $1 WHERE id = $2`,
      [newStatus, id]
    );

    // Find linked restaurant
    const r = await db.query(
      `SELECT restaurant_id FROM restaurant_menu WHERE menu_item_id = $1 LIMIT 1`,
      [id]
    );

    res.redirect(`/menu/restaurant/${r.rows[0].restaurant_id}`);
  } catch (err) {
    console.error('Error toggling availability:', err);
    res.status(500).send('Error toggling availability');
  }
};
