import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc Register new user
// @route POST /api/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        const error = new Error(`Please add all the fields`);
        error.status = 400;
        return next(error);
    }
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error(`User already exists`);
        error.status = 400;
        return next(error);
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(newUser);
})

// @desc Sign in user
// @route POST /api/auth/signin
// @access Public
export const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (validUser && await bcrypt.compare(password, validUser.password)) {
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }).status(200).json(rest);
    } else {
        const error = new Error('Invalid email or password');
        error.status = 400;
        return next(error);
    }
})

// @desc Google OAuth Sign in
// @route POST /api/auth/google
// @access Public
export const google = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const { password, ...rest } = user._doc;
            return res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        } else {
            // Generate a random password for the new user
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatePassword, salt);

            const username = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = await User.create({
                username,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const { password, ...rest } = newUser._doc;

            return res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (err) {
        console.error('OAuth Error:', err); // Log the error for debugging
        return next(err); // Pass the original error to the error handling middleware
    }
});