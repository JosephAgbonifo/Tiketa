import { Schema, model,Document, Types } from "mongoose";

export interface ITransaction extends Document {
  from?: Types.ObjectId; // optional because some transactions might be system-generated
  to?: Types.ObjectId;
  ticket?: Types.ObjectId;
  amount: number;
  txHash?: string;
  type: "purchase" | "transfer";
  status: "pending" | "completed" | "failed";
}

const TransactionSchema = new Schema<ITransaction>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
    amount: { type: Number, required: true },
    txHash: { type: String, unique: true, sparse: true }, // optional unique
    type: { type: String, enum: ["purchase", "transfer"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

const Transaction = model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
