import mongoose from "mongoose";

async function connectdb() {
    try {
          const URL=process.env.MONGO_URI;
        const connection = await mongoose.connect(URL);
        console.log("Database connected successfuly");
    } catch (error) {
        console.log("Mongodb connection failed:",error);
        process.exit(1);
    }
}

export default connectdb;