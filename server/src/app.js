import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

/*
 * CORS
 *
 * Frontend must be allowed to send credentials
 * because the refresh token is stored in an HttpOnly cookie.
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

/*
 * Body Parser
 */
app.use(express.json());

/*
 * Cookie Parser
 *
 * Required for:
 * req.cookies.refreshToken
 */
app.use(cookieParser());

/*
 * Routes
 */
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/resumes", resumeRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/interviews", interviewRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

/*
 * 404 Handler
 */
app.use(notFound);

/*
 * Global Error Handler
 */
app.use(errorMiddleware);

export default app;
