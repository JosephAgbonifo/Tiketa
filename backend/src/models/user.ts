import mongoose, { Schema } from "mongoose";
// User interface WITHOUT extending Document
export interface IUser {
  accessToken?: string;
  username?: string;
  uid?: string;
  roles?: string[];
  ticketsOwned?: string[];
}

// Define schema WITHOUT <IUser> generic
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    uid: { type: String, unique: true },
    accessToken: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
    ticketsOwned: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
