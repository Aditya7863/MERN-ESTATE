import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import { connectDB } from './db/db.js'; 

connectDB();
const app = express();

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Listening on port number ${process.env.PORT}`);
});