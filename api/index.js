import express from 'express';

const app = express();

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Listening on port number ${process.env.PORT}`)
})