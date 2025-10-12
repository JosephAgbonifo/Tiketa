import "express-session";
import { IUser } from "../models";

declare module "express-session" {
  interface SessionData {
    currentUser: IUser | null;
  }
}
