import mongoose from 'mongoose';

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB Connected');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed');
    console.error(error.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('MongoDB Disconnected');
}