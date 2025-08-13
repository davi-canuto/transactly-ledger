import mongoose, { Document, Schema } from 'mongoose'

export interface IAccount extends Document {
  name: string
  initial_balance_cents: number
  balance_cents: number
  createdAt: Date
  updatedAt: Date
  toJSON(): any
}

const accountSchema = new Schema<IAccount>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    initial_balance_cents: {
      type: Number,
      required: true,
      default: 0,
    },
    balance_cents: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

accountSchema.methods.toJSON = function (this: IAccount) {
  const account = this.toObject()
  account.id = account._id.toString()
  return account
}

export default mongoose.model<IAccount>('Account', accountSchema)
