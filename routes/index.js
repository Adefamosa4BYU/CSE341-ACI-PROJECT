const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/trainings', require('./trainings'));

module.exports = router;