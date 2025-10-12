import { Router } from "express";
import {
  handleIncompletePayment,
  approvePayment,
  completePayment,
  cancelPayment,
} from "../controllers/paymentController";
import { verifyUser } from "../middlewares/verify";

export default function mountPaymentsEndpoints(router: Router) {
  router.post("/incomplete", handleIncompletePayment);
  router.post("/approve", verifyUser, approvePayment);
  router.post("/complete", completePayment);
  router.post("/cancelled_payment", cancelPayment);
}
