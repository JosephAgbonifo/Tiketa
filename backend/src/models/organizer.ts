import { Schema, model, Document, Types } from "mongoose";

export interface IOrganizer extends Document {
  user: Types.ObjectId;
  organizationName?: string;
  bio?: string;
  verified: boolean;
}

const OrganizerSchema = new Schema<IOrganizer>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationName: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Organizer = model<IOrganizer>("Organizer", OrganizerSchema);
export default Organizer;
