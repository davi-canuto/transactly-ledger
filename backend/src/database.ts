import mongoose from 'mongoose'

const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/transactly-ledger'

    await mongoose.connect(mongoUri)

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export { connectDatabase }
