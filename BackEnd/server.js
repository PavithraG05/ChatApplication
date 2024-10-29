const express = require('express')
const dotenv = require("dotenv")
const connectDB = require("./config/dbconnect")
const colors = require("colors")
const cors = require('cors')

dotenv.config()
connectDB();
const PORT = process.env.PORT||3000

const app = express()
app.use(cors())
app.use (express.json())

app.get("/",(req,res)=>{
    res.send("API is running");
})

const userRoutes = require('./routes/userRoutes')
app.use('/api/user',userRoutes);

app.all('*',(req, res, next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Route not Found ${req.originalUrl} on the server!`,
    // })
    let message = `Route not Found ${req.originalUrl} on the server!`;
    const err=new Error(message);
    err.statusCode=404;
    err.status='fail';
    next(err);
})

//handling global errors in middleware
app.use((error, req, res, next)=>{
    error.statusCode = error.statusCode||500;
    error.status=error.status||'error';
    error.message=error.message||'error occured';
    res.status(error.statusCode).json({
        statusCode: error.statusCode,
        status:error.status,
        message:error.message,
    })
})

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))