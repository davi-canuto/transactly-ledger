import mongoose, { Document, Schema } from 'mongoose'

export interface IAccount extends Document {
  name: string
  initialBalanceCents: number
  balanceCents: number
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
      unique: true,
    },
    initialBalanceCents: {
      type: Number,
      required: true,
      default: 0,
    },
    balanceCents: {
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
