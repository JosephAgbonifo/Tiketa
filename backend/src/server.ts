import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import logger from "morgan";
import MongoStore from "connect-mongo";
import env from "./environments";
import mountPaymentsEndpoints from "./routes/paymentRoute";
import mountUserEndpoints from "./routes/userRoute";

// We must import typedefs for ts-node-dev to pick them up when they change (even though tsc would supposedly
// have no problem here)
// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata#comment125163548_65381085
import "./types/session";
import mountEventEndpoints from "./routes/eventRoute";

const mongoUri = "mongodb+srv://joesefair:@joesef.dpwrhzb.mongodb.net/";
const mongoClientOptions = {};

//
const app: express.Application = express();

// Serve uploaded images statically
// Serve main uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Log requests to the console in a compact format:
app.use(logger("dev"));

// Full log of all requests to /log/access.log:
app.use(
  logger("common", {
    stream: fs.createWriteStream(
      path.join(__dirname, "..", "log", "access.log"),
      { flags: "a" }
    ),
  })
);

// Enable response bodies to be sent as JSON:
app.use(express.json());

// Handle CORS:
app.use(
  cors({
    origin: env.frontend_url,
    credentials: true,
  })
);

// Handle cookies 🍪
app.use(cookieParser());

// Use sessions:
app.use(
  session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      mongoOptions: mongoClientOptions,
      dbName: "tiketa",
      collectionName: "user_sessions",
    }),
  })
);

//
// II. Mount app endpoints:
//

// Payments endpoint under /payments:
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use("/payments", paymentsRouter);

// User endpoints (e.g signin, signout) under /user:
const eventRouter = express.Router();
mountEventEndpoints(eventRouter);
app.use("/event", eventRouter);

// User endpoints (e.g signin, signout) under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use("/user", userRouter);

// Hello World page to check everything works:
app.get("/", async (_, res) => {
  res.status(200).send({ message: "Hello, World!" });
});

// III. Boot up the app:

app.listen(env.port, async () => {
  try {
    await mongoose.connect(mongoUri, mongoClientOptions);
    console.log("✅ Connected to MongoDB with Mongoose on:", mongoUri);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
  console.log("App platform demo app - Backend listening on port 8000!");
  console.log(
    `CORS config: configured to respond to a frontend hosted on ${env.frontend_url}`
  );
});
