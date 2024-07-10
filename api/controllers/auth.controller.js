import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

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