const express = require('express')
const dotenv = require("dotenv")
const connectDB = require("./config/dbconnect")
const colors = require("colors")
const cors = require('cors')
const CustomError = require('./utils/CustomError')
const globalErrorHandler = require('./utils/errorHandler')

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

const chatRoutes = require('./routes/chatRoutes')
app.use('/api/chat',chatRoutes);

app.all('*',(req, res, next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Route not Found ${req.originalUrl} on the server!`,
    // })

    //sending to global error handler
    // let message = `Route not Found ${req.originalUrl} on the server!`;
    // const err=new Error(message);
    // err.statusCode=404;
    // err.status='fail';
    // next(err);

    //making use of customerror class and send to global error handler
    let message = `Route not Found ${req.originalUrl} on the server!`;
    const err = new CustomError(404, message);
    next(err);
})

//handling global errors in middleware
app.use(globalErrorHandler);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))