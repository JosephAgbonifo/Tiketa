import { Schema, model, Document, Types } from "mongoose";

export interface IEvent extends Document {
  eventId: string; // ✅ unique event ID (uuid)
  title: string;
  description?: string;
  date: Date;
  time: string;
  meetingType: "physical" | "online";
  location: string;
  capacity: number;
  address: string;
  ticketType: "free" | "paid";
  price?: number;
  image?: string;
  organizer: Types.ObjectId;
  tickets: Types.ObjectId[];
}

const EventSchema = new Schema<IEvent>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true, // ensure no duplicates
    },
    title: { type: String, required: true },
    description: { type: String },
    meetingType: { type: String, enum: ["physical", "online"], required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    ticketType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
      default: "paid",
    },
    price: {
      type: Number,
      required: function (this: IEvent) {
        return this.ticketType === "paid";
      },
    },
    image: { type: String },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
  },
  { timestamps: true }
);

const Event = model<IEvent>("Event", EventSchema);
export default Event;
