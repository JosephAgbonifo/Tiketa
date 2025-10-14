import axios from "axios";
import { Request, Response } from "express";
import platformAPIClient from "../services/platformAPIClient";
import { Transaction, Ticket, User, Event } from "../models";
import { v4 as uuidv4 } from "uuid";

/**
 * Handle incomplete Pi payment
 */
export const handleIncompletePayment = async (req: Request, res: Response) => {
  try {
    const payment = req.body.payment;
    const paymentId = payment.identifier;
    const txid = payment.transaction?.txid;
    const txURL = payment.transaction?._link;

    const txn = await Transaction.findOne({ txHash: paymentId }).populate(
      "ticket"
    );
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    // ✅ Verify payment on Pi blockchain
    const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
    const memo = horizonResponse.data.memo;

    console.log("Handling incomplete payment:", req.body);
    if (memo !== paymentId)
      return res
        .status(400)
        .json({ message: "Payment memo does not match payment ID" });

    if (horizonResponse.data.success !== true)
      return res.status(400).json({ message: "Payment not successful" });

    // ✅ Mark transaction as completed
    txn.txHash = txid;
    txn.status = "completed";
    await txn.save();

    // // ✅ Mark ticket active if linked
    if (txn.ticket) {
      await Ticket.findByIdAndUpdate(txn.ticket, { status: "active" });
    }

    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, {
      txid,
    });

    console.log(`✅ Completed incomplete payment ${paymentId}`);
  } catch (err: any) {
    // console.error("❌ Error handling incomplete payment:", err);
    console.log("❌ Error handling incomplete payment:", err);
  }
};

/**
 * Approve Pi payment → Register user for event
 */
export const approvePayment = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: string }).user;
    if (!user)
      return res.status(401).json({ message: "Unauthorized: user not found" });

    const { paymentId } = req.body;
    console.log(paymentId);
    const payment = await platformAPIClient.get(`/v2/payments/${paymentId}`);
    const { eventId, price } = payment.data.metadata;

    // 🔹 Find event & user
    const event = await Event.findOne({ eventId });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const activeUser = await User.findOne({ username: user });
    if (!activeUser) return res.status(404).json({ message: "User not found" });

    // 🔹 Check event capacity
    const ticketCount = await Ticket.countDocuments({ event: event._id });
    if (ticketCount >= event.capacity)
      return res.status(400).json({ message: "Event capacity reached" });

    // 🔹 Prevent duplicate registration
    const existingTicket = await Ticket.findOne({
      event: event._id,
      owner: activeUser._id,
    });
    if (existingTicket)
      return res
        .status(400)
        .json({ message: "You already registered for this event" });

    // ✅ Create ticket (register user)
    const ticket = await Ticket.create({
      event: event._id,
      owner: activeUser._id,
      price: event.price || price,
      tokenId: uuidv4(),
      status: "active",
    });

    // ✅ Create a pending transaction
    const txn = await Transaction.create({
      from: activeUser._id,
      to: event.organizer,
      ticket: ticket._id,
      amount: event.price || price,
      txHash: paymentId, // temporary Pi identifier
      type: "purchase",
      status: "pending",
    });

    // ✅ Notify Pi that you’re ready to complete payment
    await platformAPIClient.post(`/v2/payments/${paymentId}/approve`);

    return res.status(200).json({
      message: `✅ Approved and registered for event ${event.title}`,
      ticket,
      transaction: txn,
    });
  } catch (err: any) {
    console.error("❌ Error approving payment:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Complete payment (after Pi finalizes the transaction)
 */
export const completePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, txid } = req.body;

    const txn = await Transaction.findOne({ txHash: paymentId });
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    txn.txHash = txid;
    txn.status = "completed";
    await txn.save();

    if (txn.ticket) {
      await Ticket.findByIdAndUpdate(txn.ticket, { status: "active" });
    }

    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, {
      txid,
    });

    return res.status(200).json({
      message: `✅ Completed payment ${paymentId}`,
      transaction: txn,
    });
  } catch (err: any) {
    console.error("❌ Error completing payment:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Cancel Pi payment (user cancels mid-flow)
 */
export const cancelPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    const txn = await Transaction.findOneAndUpdate(
      { txHash: paymentId },
      { status: "failed" },
      { new: true }
    );

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.ticket) {
      await Ticket.findByIdAndUpdate(txn.ticket, { status: "cancelled" });
    }

    return res.status(200).json({
      message: `🚫 Cancelled payment ${paymentId}`,
      transaction: txn,
    });
  } catch (err: any) {
    console.error("❌ Error cancelling payment:", err);
    return res.status(500).json({ error: err.message });
  }
};
