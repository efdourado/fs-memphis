import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

export async function connectToDatabase() {
  try {
    await mongoose.connect(URI, {
      dbName: DB_NAME,
    });
    console.log('Mongoose conectado ao MongoDB');
  } catch (error) {
    console.error('erro ao conectar com o MongoDB via Mongoose:', error.message);
    throw error;
} }