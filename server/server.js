import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import colors from "colors";
import app from "./src/app.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`.bgBlue.white);
});
