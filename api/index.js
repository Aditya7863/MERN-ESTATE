import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import { connectDB } from './db/db.js';
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/error.js';

connectDB();
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);



app.use(notFound);
app.use(errorHandler);


app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port number ${process.env.PORT}`);
});