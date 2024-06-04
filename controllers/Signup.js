const router = require('express').Router();
const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', async (req, res) => {
    try {
        // Validate user input
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "That email has been used by another user" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user instance
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            isVerified: false,
        });
        // Send verification email
            await user.save();
            // Generate JWT token
            const token = jwt.sign(
                { _id: user._id, email: user.email, phone: user.phone },
                process.env.JWT,
                { expiresIn: '24h' } // Token expires in 1 hour
            );
            return res.status(201).send({ token, message: `Account created for ${user.lastName} ` })
    } catch (serverError) {
        return res.status(500).json({ message:serverError.message });
    }
});

module.exports = router;
