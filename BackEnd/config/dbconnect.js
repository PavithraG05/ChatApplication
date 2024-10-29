const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`connected successfully ${conn.connection.host}`.cyan.underline);
    }
    catch(error){
        console.log(`Connection Failed ${error}`.red);
        process.exit(0);
    }
}

module.exports = connectDB;