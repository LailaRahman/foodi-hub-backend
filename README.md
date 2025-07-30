
# Foodi-Hub Backend

## Project Purpose

Foodi-Hub is a public food ordering platform backend. It allows users to:

* Browse restaurants
* View menu items for each restaurant
* Place orders with selected food items and quantities
* Track orders
* Manage customer information

This is a real-world system meant to simulate how food ordering systems work—without any user login or authentication required.

---

## How to Run

### Prerequisites

* Node.js (v16 or later)
* PostgreSQL(managed via pgAdmin)

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/LailaRahman/foodi-hub-backend
   cd foodi-hub-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   The project uses the following core dependencies:

   * cors
   * dotenv
   * ejs
   * express
   * helmet
   * method-override
   * nodemon (for development)
   * pg (PostgreSQL client)

3. Create a `.env` file in the root directory with the following contents:

   ```
   PORT=3000
   DATABASE_URL=postgresql://postgres:MyNewPass123!@localhost:5432/foodi_hub_db
   ```

4. Set up the PostgreSQL database:

   * Create a new database named `FOODIHUB`.
   * Run the SQL schema (`schema.sql`) to generate the tables. You can do this via pgAdmin or the command line:

     ```bash
     psql -U postgres -d FOODIHUB -f schema.sql
     ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and go to:

   ```
   http://localhost:3000
   ```

---

## Database Design

### Tables

* `restaurants`: Stores restaurant details (id, name, address)
* `customers`: Stores customer data (id, name, email)
* `menu_items`: Food items shared across restaurants (id, name, price)
* `restaurant_menu`: Join table linking restaurants and menu items (many-to-many)
* `orders`: Orders placed by customers for a specific restaurant
* `order_items`: Items included in each order, with quantities

### Relationships

* A restaurant can have many menu items.
* A menu item can be offered at many restaurants.
* An order is placed by one customer for one restaurant.
* Each order includes multiple items, each with a quantity.

---

## API Endpoints

### Restaurants

* `GET /restaurants`
  Returns a list of all restaurants.

* `GET /restaurants/:id`
  Returns details for a specific restaurant.

* `GET /restaurants/create`
  Displays a form to add a new restaurant.

* `POST /restaurants/create`
  Adds a new restaurant.

* `GET /restaurants/edit/:id`
  Displays a form to edit a restaurant.

* `PUT /restaurants/edit/:id`
  Updates an existing restaurant.

* `DELETE /restaurants/delete/:id`
  Deletes a restaurant.

---

### Menu

* `GET /menu`
  Redirects to the menu of the default restaurant (ID 1).

* `GET /menu/restaurant/:restaurantId`
  Lists menu items for a given restaurant.

* `GET /menu/restaurant/:restaurantId/new`
  Displays a form to add a new menu item.

* `POST /menu/restaurant/:restaurantId/new`
  Adds a new menu item to the restaurant.

* `GET /menu/edit/:id`
  Displays a form to edit a menu item.

* `PUT /menu/edit/:id`
  Updates a specific menu item.

* `DELETE /menu/delete/:id`
  Deletes a menu item.

* `POST /menu/toggle/:id`
  Toggles availability (active/inactive) of a menu item.

---

### Customers

* `GET /customers`
  Lists all customers.

* `GET /customers/create`
  Displays a form to add a new customer.

* `POST /customers/create`
  Adds a new customer.

* `GET /customers/edit/:id`
  Displays a form to edit a customer.

* `PUT /customers/edit/:id`
  Updates customer information.

* `DELETE /customers/delete/:id`
  Deletes a customer.

---

### Orders

* `GET /orders`
  Lists all orders, including customer and item details.

* `GET /orders/create`
  Displays a form to place a new order.

* `POST /orders/create`
  Submits a new order (with multiple items and quantities).

* `PUT /orders/status/:id`
  Updates the order status (e.g., pending, completed, cancelled).

* `DELETE /orders/delete/:id`
  Deletes an order.

## Notes

* The backend is built using Express.js with EJS templating for server-side rendering.
* PostgreSQL is used for database management.
* `method-override` is used to simulate PUT and DELETE requests via HTML forms.
* Controllers handle validation and error responses for cleaner routing logic.
* Order quantity management and displaying ordered items per order will be handled in the system soon.

