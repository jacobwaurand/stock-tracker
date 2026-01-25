import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { signUp, login } from "./controllers/auth";
import { getOpeningPrice } from "./controllers/stocks";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173", // Your Vite dev server
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Public Routes
app.post("/auth/signup", signUp);
app.post("/auth/login", login);

// Protected Routes (Requires JWT)
const authMiddleware = jwt({ secret: process.env.JWT_SECRET!, alg: "HS256" });

app.get("/stocks/open", authMiddleware, getOpeningPrice);

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
