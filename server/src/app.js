import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Middlewares
import errorMiddleware from "./middleware/errorMiddleware.js";
import notFound from "./middleware/notFound.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resumes", resumeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/interviews", interviewRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFound);

app.use(errorMiddleware);
export default app;
