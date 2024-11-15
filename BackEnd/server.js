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

const messageRoutes = require('./routes/messageRoutes')
app.use('/api/message',messageRoutes);

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

const appServer = app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

const io = require('socket.io')(appServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173',
    }
});

io.on("connection",(socket)=>{
    // console.log(socket);
    console.log("Connected to socket.io");
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat",(room) => {
        socket.join(room);
        console.log("User joined room:"+ room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

})
 
