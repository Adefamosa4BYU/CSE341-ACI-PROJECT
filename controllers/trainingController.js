const Training = require("../models/Training");
const { validationResult } = require("express-validator");

// GET all trainings
exports.getAllTrainings = async (req, res, next) => {
    //#swagger.tags=['Training']
    // #swagger.path = '/api/trainings'
  try {
    const trainings = await Training.find();
    res.json({ success: true, data: trainings });
  } catch (err) {
    next(err);
  }
};

// GET by ID
exports.getTrainingById = async (req, res, next) => {
    // #swagger.tags = ['Training']
    // #swagger.path = '/api/trainings/{id}'
    try {
        const training = await Training.findById(req.params.id);

        if (!training) return res.status(404).json({ message: 'Training not found' });

        res.json(training);

    } catch (err) {
        next(err);
    }
};

// POST training
exports.createTraining = async (req, res, next) => {
    //#swagger.tags=['Training']
    // #swagger.path = '/api/trainings'
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, date, level, location, capacity, instructor, duration } = req.body;

    const training = await Training.create({
        title, 
        description, 
        date, 
        level, 
        location, 
        capacity, 
        instructor, 
        duration
    });
    res.status(201).json({ success: true, data: training });
  } catch (err) {
    next(err);
  }
};

// PUT
exports.updateTraining = async (req, res, next) => {
    // #swagger.tags = ['Training']
    // #swagger.path = '/api/trainings/{id}'
    try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
        const trainingId = req.params.id;

        const { title, description, date, level, location, capacity, instructor, duration } = req.body;

        const updatedTraining = await Training.findByIdAndUpdate(
            trainingId,
            {

                title, 
                description, 
                date, 
                level, 
                location, 
                capacity, 
                instructor, 
                duration,
            },
            { new: true, runValidators: true }
        );

        if (!updatedTraining) {
            return res.status(404).json({ message: "Training not found" });
        }
        
        res.json({ success: true, data: updatedTraining });
    } catch (err) {
        next(err);
    }
};

// DELETE
exports.deleteTraining = async (req, res, next) => {
    // #swagger.tags = ['Training']
    // #swagger.path = '/api/trainings/{id}'
    try {
        const trainingId = req.params.id;

        const deletedTraining = await Training.findByIdAndDelete(trainingId);

        if (!deletedTraining) {
            return res.status(404).json({ message: "Training not found" });
        }

        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};
