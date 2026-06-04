const express = require('express');
const { getMenuItems } = require('../controllers/menuController');

const router = express.Router();

router.get('/', getMenuItems);

module.exports = router;
