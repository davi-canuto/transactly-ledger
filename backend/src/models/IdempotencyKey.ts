import mongoose, { Schema, Document } from 'mongoose'

export interface IIdempotencyKey extends Document {
  key: string
  result: any
  createdAt: Date
}

const idempotencyKeySchema = new Schema<IIdempotencyKey>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  result: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // TTL: 24 hours
  },
})

export const IdempotencyKey = mongoose.model<IIdempotencyKey>('IdempotencyKey', idempotencyKeySchema)