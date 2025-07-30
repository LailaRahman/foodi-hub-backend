const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.list);
router.get('/create', orderController.showCreateForm);
router.post('/create', orderController.create);
router.put('/status/:id', orderController.updateStatus);
router.delete('/delete/:id', orderController.delete);

module.exports = router;
