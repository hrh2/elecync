const router = require('express').Router()
const { Meter} = require('../models/Meter')
const {verifyToken } = require('../middlewares/auth')


// POST route to create a new meter reading
router.post('/', async (req, res) => {
  const { error } = validateMeter(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { voltage, current, energy, frequency, pf } = req.body;
  try {
    const meter = new Meter({ voltage, current, energy, frequency, pf });
    await meter.save();
    return res.status(201).json({ meterId: meter._id, message: 'Values saved' });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: `Internal server error, please try again later: ${err.message}` });
  }
});

// GET route to retrieve all meter readings
router.get('/', verifyToken, async (req, res) => {
  try {
    const meters = await Meter.find();
    if (meters.length === 0) {
      return res.status(404).json({ message: 'No measurements found' });
    }
    return res.status(200).json(meters);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

module.exports = router;
