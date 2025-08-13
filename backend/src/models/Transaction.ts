import mongoose, { Document, Schema, Types } from 'mongoose'

export interface ITransaction extends Document {
  from: Types.ObjectId | any
  to: Types.ObjectId | any
  amount_cents: number
  entries: Types.ObjectId[] | any[]
  createdAt: Date
  updatedAt: Date
  toJSON(): any
}

const transactionSchema = new Schema<ITransaction>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    amount_cents: {
      type: Number,
      required: true,
      min: 1,
    },
    entries: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LedgerEntry',
      },
    ],
  },
  {
    timestamps: true,
  }
)

transactionSchema.methods.toJSON = function (this: ITransaction) {
  const transaction = this.toObject()
  transaction.id = transaction._id.toString()
  return transaction
}

export default mongoose.model<ITransaction>('Transaction', transactionSchema)
