const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { trainingRules, updateTrainingRules, validate } = require("../middleware/validation");

const { 
  getAllTrainings, 
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining
} = require('../controllers/trainingController');

// GET all Trainings
// #swagger.tags = ['Training']
// #swagger.path = '/api/trainings'
router.get('/', getAllTrainings);

// GET single Training by ID
// #swagger.tags = ['Training']
// #swagger.path = '/api/trainings/{id}'
router.get('/:id', getTrainingById);

// POST to create a Training
// #swagger.tags = ['Training']
// #swagger.path = '/api/trainings'
router.post('/', auth, role("admin", "staff"), trainingRules(), validate, createTraining);

// PUT to update a single Training
// #swagger.tags = ['Training']
// #swagger.path = '/api/trainings/{id}'
router.put('/:id', auth, role("admin", "staff"), updateTrainingRules(), validate, updateTraining);

// DELETE to delete a single Training
// #swagger.tags = ['Training']
// #swagger.path = '/api/trainings/{id}'
router.delete('/:id', auth, role("admin"), deleteTraining);

module.exports = router;