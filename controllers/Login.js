require('dotenv').config();
const router = require('express').Router();
const { User, validateOnLogin } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
   try {
      const { error } = validateOnLogin(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
      // Remove whitespace from email/phone input
      const email_phone = req.body.email_phone.replace(/\s/g, "");
      // Check if email_phone contains only digits (valid phone number)
      const isNumeric = /^\d+$/.test(email_phone);
      let user;
      if (isNumeric) {
         user = await User.findOne({ phone: parseInt(email_phone) });
      } else {
         user = await User.findOne({ email: email_phone });
      }
      if (!user) return res.status(401).send({ message: 'Invalid Email/Phone or Password' });
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(401).send({ message: 'Invalid Email/Phone or Password' });

      const token = jwt.sign({ _id: user._id, email: user.email, phone: user.phone }, process.env.JWT);
      res.status(201).send({ token: token,message:`${user.lastName} you have Successfully logged  in ` });
   } catch (err) {
      res.status(500).send({ message: err.message });
   }
});

// data validation functions

module.exports = router;
