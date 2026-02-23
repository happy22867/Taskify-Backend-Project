const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "https://taskify-backend-project-vrjk.vercel.app",
  "https://taskify-backend-project.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/tasks", require("./src/routes/taskRoutes"));
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);