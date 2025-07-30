const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', (req, res) => {
  res.redirect('/menu/restaurant/1');
});

router.get('/restaurant/:restaurantId', menuController.listByRestaurant);
router.get('/restaurant/:restaurantId/new', menuController.showCreateForm);
router.post('/restaurant/:restaurantId/new', menuController.create);

router.get('/edit/:id', menuController.showEditForm);
router.put('/edit/:id', menuController.update);

router.delete('/delete/:id', menuController.delete);
router.post('/toggle/:id', menuController.toggleAvailability);

module.exports = router;
