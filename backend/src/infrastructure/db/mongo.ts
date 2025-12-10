import mongoose from "mongoose";
import { env } from "../../config/env";


export const connectDB=async ()=>{
    try {
        await mongoose.connect(env.MONGO_URL)
        console.log('MongoDb  Connected Successfully');
    } catch (error) {
        console.log(' Mongodb connection Error',error)
        process.exit(1)
    }
}