import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { createAccount, signIn } from "./controllers/auth";
import { getOpeningPrice } from "./controllers/stocks";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://stock-tracker-1-gve6.onrender.com",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.post("/auth/create-account", createAccount);
app.post("/auth/sign-in", signIn);

const authMiddleware = jwt({ secret: process.env.JWT_SECRET!, alg: "HS256" });

app.get("/stocks/open", authMiddleware, getOpeningPrice);

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
