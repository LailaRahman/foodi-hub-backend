const db = require('../models/database');

// List all orders
exports.list = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, c.name AS customer_name, r.name AS restaurant_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN restaurants r ON o.restaurant_id = r.id
      ORDER BY o.id DESC
    `);
    res.render('orders/list', { orders: result.rows });
  } catch (err) {
    res.status(500).send('Error fetching orders');
  }
};

// Show create form
exports.showCreateForm = async (req, res) => {
  try {
    const customers = await db.query('SELECT * FROM customers');
    const restaurants = await db.query('SELECT * FROM restaurants');
    const menuItems = await db.query('SELECT * FROM menu_items');

    res.render('orders/create', {
      customers: customers.rows,
      restaurants: restaurants.rows,
      menuItems: menuItems.rows
    });
  } catch (err) {
    res.status(500).send('Error loading form');
  }
};

// Create new order
exports.create = async (req, res) => {
  const { customer_id, restaurant_id, items } = req.body;

  try {
    const orderResult = await db.query(
      `INSERT INTO orders (customer_id, restaurant_id) VALUES ($1, $2) RETURNING id`,
      [customer_id, restaurant_id]
    );
    const orderId = orderResult.rows[0].id;

    const itemEntries = Array.isArray(items) ? items : [items];
    for (let entry of itemEntries) {
      const [menuItemId, quantity] = entry.split('-'); 
      await db.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3)`,
        [orderId, menuItemId, quantity]
      );
    }

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating order');
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.redirect('/orders');
  } catch (err) {
    res.status(500).send('Error updating status');
  }
};

// Delete order
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    await db.query('DELETE FROM orders WHERE id = $1', [id]);
    res.redirect('/orders');
  } catch (err) {
    res.status(500).send('Error deleting order');
  }
};
