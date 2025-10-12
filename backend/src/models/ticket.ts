import { Schema, model, Document, Types } from "mongoose";

export interface ITicket extends Document {
  event: Types.ObjectId;
  owner: Types.ObjectId;
  price: number;
  tokenId?: string; // NFT/collectible ID, optional because it might be assigned later
  status: "active" | "used" | "transferred";
}

const TicketSchema = new Schema<ITicket>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true, min: 0 },
    tokenId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ["active", "used", "transferred"], default: "active" },
  },
  { timestamps: true }
);

const Ticket =model<ITicket>("Ticket", TicketSchema);
export default Ticket;
