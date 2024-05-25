const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
  
module.exports = connectToDB