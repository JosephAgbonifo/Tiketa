import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import env from "./environments";
import mountPaymentsEndpoints from "./routes/paymentRoute";
import mountUserEndpoints from "./routes/userRoute";

// We must import typedefs for ts-node-dev to pick them up when they change (even though tsc would supposedly
// have no problem here)
// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata#comment125163548_65381085
import "./types/session";
import mountEventEndpoints from "./routes/eventRoute";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not set");
}

const mongoClientOptions = {};

//
const app: express.Application = express();

// Enable response bodies to be sent as JSON:
app.use(express.json());
const allowedOrigins = [
  env.frontend_url,
  "https://morphevent.vercel.app",
  "http://localhost:3000",
];

// Handle CORS:
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
