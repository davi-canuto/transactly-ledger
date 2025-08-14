import mongoose, { Document, Schema, Types } from 'mongoose'

export interface ILedgerEntry extends Document {
  account: Types.ObjectId | any
  amountCents: number
  transaction: Types.ObjectId | any
  meta: Record<string, any>
  createdAt: Date
  updatedAt: Date
  toJSON(): any
}

const ledgerEntrySchema = new Schema<ILedgerEntry>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    amountCents: {
      type: Number,
      required: true,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

ledgerEntrySchema.methods.toJSON = function (this: ILedgerEntry) {
  const entry = this.toObject()
  entry.id = entry._id.toString()
  return entry
}

export default mongoose.model<ILedgerEntry>('LedgerEntry', ledgerEntrySchema)
