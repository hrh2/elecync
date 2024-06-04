const router = require('express').Router()
const { Meter} = require('../models/Meter')
const {verifyToken } = require('../middlewares/auth')

router.post('/', async (req, res) => {
  const {voltage,current,energy,frequency,pf} = req.body
  try {
    const meter = new Meter({voltage,current,energy,frequency,pf})
    await meter.save()
    return res.status(201).json({ meterId: meter._id, message: `values saved` })
  }
  catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: `Internal error server, please try again later : ${err.message}` })
  }
})



router.get('/',verifyToken, async (req, res) => {
  try {
    const meter = await Meter.find();

    if (!meter) {
      return res.status(404).json({ message: 'No measurement found' });
    }

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: `Internal error: ${error.message}` });
  }
});


module.exports = router