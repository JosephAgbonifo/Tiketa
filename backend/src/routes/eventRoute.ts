import { Router } from "express";
import {
  check,
  create,
  get,
  getRegistrations,
  myTickets,
  register,
  verifyTicket,
} from "../controllers/eventController";
import { verifyUser } from "../middlewares/verify";
import { uploadImageMiddleware } from "middlewares/upload";

export default function mountEventEndpoints(router: Router) {
  router.post("/create", verifyUser, uploadImageMiddleware, create);
  router.post("/verify", verifyUser, verifyTicket);
  router.get("/get", verifyUser, get);
  router.get("/get/:id", verifyUser, get);
  router.get("/getall", get);
  router.post("/register", verifyUser, register);
  router.get("/check-registration/:id", verifyUser, check);
  router.get("/ticket/mine", verifyUser, myTickets);
  router.get("/registrations/:id", verifyUser, getRegistrations);
}
