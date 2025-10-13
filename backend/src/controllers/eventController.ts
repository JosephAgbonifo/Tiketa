import { Request, Response, NextFunction } from "express";
import { Event, User, Ticket } from "../models";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

/**
 * CREATE EVENT
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let eventDetails;

    // 🧩 Parse eventDetails safely
    try {
      eventDetails = JSON.parse(req.body.eventDetails);
    } catch {
      return res.status(400).json({ message: "Invalid eventDetails format" });
    }

    const user = (req as Request & { user?: string }).user;
    const imageFile = (req as Request & { file?: Express.Multer.File }).file;

    if (!user)
      return res.status(401).json({ message: "Unauthorized: user not found" });

    const {
      title,
      description,
      date,
      time,
      location,
      meetingType,
      capacity,
      ticketType,
      price,
    } = eventDetails;

    if (!title || !date || !time || !location || !capacity || !ticketType)
      return res.status(400).json({ message: "Missing required fields" });

    if (ticketType === "paid" && (!price || price <= 0))
      return res
        .status(400)
        .json({ message: "Paid events require a valid price" });

    const activeUser = await User.findOne({ username: user });
    if (!activeUser) return res.status(404).json({ message: "User not found" });

    const newEvent = await Event.create({
      eventId: uuidv4(),
      title,
      description,
      date,
      time,
      meetingType,
      location,
      capacity,
      ticketType,
      price: ticketType === "free" ? 0 : price,
      image: imageFile ? imageFile.filename : null,
      organizer: activeUser._id,
      tickets: [],
    });

    return res.status(201).json({
      success: true,
      message: `✅ Event created successfully by user ${user}`,
      event: newEvent,
    });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    next(err);
  }
};

/**
 * GET EVENTS (ALL OR BY ID)
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { mine } = req.query;
    const user = (req as Request & { user?: string }).user;

    console.log("🟢 Incoming GET /events", { id, mine, user });

    // 🔹 Fetch single event by ID
    if (id) {
      const event = await Event.findOne({ eventId: id })
        .populate("organizer", "username email")
        .lean();

      if (!event) return res.status(404).json({ message: "Event not found" });

      return res.status(200).json(event);
    }

    // 🔹 Otherwise fetch all events (optionally filtered by organizer)
    const query: Record<string, any> = {};

    if (mine === "true" && user) {
      const activeUser = await User.findOne({ username: user });
      if (activeUser) query.organizer = activeUser._id;
    }

    // ✅ Return only the last 10 events and selected fields
    const events = await Event.find(query)
      .select(
        "eventId title description date time location ticketType price image organizer"
      )
      .populate("organizer", "username email")
      .sort({ createdAt: -1 })
      .limit(10) // Prevent memory overload
      .lean();

    console.log(`✅ Returning ${events.length} event(s)`);

    return res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    next(err);
  }
};

/**
 * REGISTER / BUY TICKET FOR EVENT
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as Request & { user?: string }).user;
    const { eventId } = req.body;

    if (!user)
      return res.status(401).json({ message: "Unauthorized: user not found" });

    if (!eventId)
      return res
        .status(400)
        .json({ message: "Missing eventId in request body" });

    // 🔹 Find event and user
    const event = await Event.findOne({ eventId });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const activeUser = await User.findOne({ username: user });
    if (!activeUser) return res.status(404).json({ message: "User not found" });

    // 🔹 Check event capacity
    const ticketCount = await Ticket.countDocuments({ event: event._id });
    if (ticketCount >= event.capacity)
      return res.status(400).json({ message: "Event capacity reached" });

    // 🔹 Check if user already has a ticket
    const existingTicket = await Ticket.findOne({
      event: event._id,
      owner: activeUser._id,
    });
    if (existingTicket)
      return res
        .status(400)
        .json({ message: "You already registered for this event" });

    // 🔹 Create ticket
    const newTicket = await Ticket.create({
      event: event._id,
      owner: activeUser._id,
      price: event.price,
      tokenId: uuidv4(), // optional: unique identifier or NFT reference
      status: "active",
    });

    // 🔹 Update event with new ticket
    event.tickets.push(newTicket._id as Types.ObjectId);
    await event.save();

    return res.status(201).json({
      message: "✅ Successfully registered for event",
      ticket: newTicket,
    });
  } catch (err) {
    console.error("❌ Error registering for event:", err);
    next(err);
  }
};

export const check = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // eventId
    const user = (req as Request & { user?: string }).user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Event ID is required" });

    const activeUser = await User.findOne({ username: user });
    if (!activeUser) return res.status(404).json({ message: "User not found" });

    // 🔹 Find the event by eventId
    const event = await Event.findOne({ eventId: id }).lean();
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 🔹 Check if user already has a ticket for this event
    const existingTicket = await Ticket.findOne({
      event: event._id,
      owner: activeUser._id,
    });

    // ✅ Return registration status
    return res.status(200).json({
      registered: !!existingTicket,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // eventId
    const user = (req as Request & { user?: string }).user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Event ID is required" });

    // 🔹 Find the logged-in user
    const activeUser = await User.findOne({ username: user });
    if (!activeUser) return res.status(404).json({ message: "User not found" });

    // 🔹 Find the event by eventId
    const event = await Event.findOne({ eventId: id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 🔹 Check if this user is the event organizer
    if (event.organizer.toString() !== activeUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the organizer of this event" });
    }

    // 🔹 Find all tickets for this event (each = a registration)
    const registrations = await Ticket.find({ event: event._id })
      .populate("owner", "username email") // get user info
      .sort({ createdAt: -1 });

    // ✅ Return total and list
    return res.status(200).json({
      count: registrations.length,
      registrations: registrations.map((r) => ({
        id: r._id,
        username: (r.owner as any)?.username,
        email: (r.owner as any)?.email,
        status: r.status,
      })),
    });
  } catch (err) {
    console.error("Error fetching registrations:", err);
    next(err);
  }
};

/**
 * GET ALL TICKETS FOR LOGGED-IN USER
 */
export const myTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as Request & { user?: string }).user;

    if (!user)
      return res.status(401).json({ message: "Unauthorized: user not found" });

    // 🔹 Find active user
    const activeUser = await User.findOne({ username: user });
    if (!activeUser) return res.status(404).json({ message: "User not found" });

    // 🔹 Find all tickets owned by this user
    const tickets = await Ticket.find({ owner: activeUser._id })
      .populate({
        path: "event",
        select: "title date location image", // only the needed fields
      })
      .select("_id tokenId status") // select only these fields from Ticket
      .sort({ createdAt: -1 }) // latest first
      .lean();

    // 🔹 Normalize response
    const formatted = tickets.map((t) => ({
      _id: t._id,
      ticketId: t.tokenId,
      status: t.status,
      event: t.event
        ? {
            _id: (t.event as any)._id,
            title: (t.event as any).title,
            date: (t.event as any).date,
            location: (t.event as any).location,
            meetingType: (t.event as any).meetingType,
            price: (t.event as any).price,
            image: (t.event as any).image || null,
          }
        : null,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching user tickets:", err);
    next(err);
  }
};

/**
 * @route   POST /event/verify
 * @desc    Verify a ticket by its ID (QR payload)
 * @access  Public or Protected (depending on your use case)
 */
export const verifyTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { qrData } = req.body;

    // qrData should contain the ticketId
    if (!qrData || !qrData.ticketId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid QR data" });
    }

    const { ticketId } = qrData;

    // find the ticket and populate owner + event
    const ticket = await Ticket.findOne({
      tokenId: ticketId,
    })
      .populate("owner", "username email")
      .populate("event", "title date time location");

    if (!ticket) {
      return res
        .status(200)
        .json({ success: false, message: "Ticket not found" });
    }

    // optional: check if ticket already used or inactive
    if (ticket.status === "used") {
      return res
        .status(200)
        .json({ success: false, message: "Ticket already used" });
    }

    // ✅ mark the ticket as used
    ticket.status = "used";
    await ticket.save();

    // ✅ success response
    return res.status(200).json({
      success: true,
      message: "Ticket verified and marked as used successfully",
      ticket: {
        id: ticket._id,
        status: ticket.status,
        owner: ticket.owner,
        event: ticket.event,
      },
    });
  } catch (error) {
    console.error("Ticket verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
