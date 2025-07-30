const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.list);
router.get('/create', customerController.showCreateForm);
router.post('/create', customerController.create);
router.get('/edit/:id', customerController.showEditForm);
router.put('/edit/:id', customerController.update);
router.delete('/delete/:id', customerController.delete);

module.exports = router;
