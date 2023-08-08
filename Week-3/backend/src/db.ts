import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db: string = process.env.MONGO_URI as string;

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(db);

    console.log('MongoDB is Connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
