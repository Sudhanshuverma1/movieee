import express from "express";
import dotenv from "dotenv";      // ✅ Explicitly import dotenv
dotenv.config();                  // ✅ Load .env variables

import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import routes from "./src/routes/index.js";  // ✅ Your routes

const app = express();

// Fix the Mongoose deprecation warning
mongoose.set('strictQuery', false);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/v1", routes);

// ✅ Root route to test deployment
app.get("/", (req, res) => {
  res.send("🎬 TMDB Movie Backend is Running!");
});

// Start Server
const port = process.env.PORT || 5000;
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("MongoDB connected!!");
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});
