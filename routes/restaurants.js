const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.list);
router.get('/create', restaurantController.createForm);
router.post('/create', restaurantController.create);
router.get('/edit/:id', restaurantController.editForm);
router.put('/edit/:id', restaurantController.update);
router.delete('/delete/:id', restaurantController.delete); 

module.exports = router;
