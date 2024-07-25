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

export const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (validUser && await bcrypt.compare(password, validUser.password)) {
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password:pass,...rest} = validUser._doc;
        
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }).status(200).json({rest});
    } else {
        const error = new Error('Invalid email or password');
        error.status = 400;
        return next(error);
    }
})