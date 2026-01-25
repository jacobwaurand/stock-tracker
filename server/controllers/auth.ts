import type { Context } from "hono";
import { sign } from "hono/jwt";
import db from "../db";

export const signUp = async (c: Context) => {
  const { email, password } = await c.req.json();

  // 1. Hash password using Bun's built-in Argon2/bcrypt wrapper
  const hashedPassword = await Bun.password.hash(password);

  try {
    // 2. Raw SQL Insert
    const [user] = await db`
      INSERT INTO users (email, password) 
      VALUES (${email}, ${hashedPassword}) 
      RETURNING id, email
    `;
    return c.json({ user, message: "User created successfully" }, 201);
  } catch (e) {
    console.error("Error during sign up:", e);
    return c.json({ error: "User already exists or DB error" }, 400);
  }
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();

  // 1. Fetch user
  const [user] = await db`SELECT * FROM users WHERE email = ${email}`;

  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  // 2. Verify password
  const isMatch = await Bun.password.verify(password, user.password);
  if (!isMatch) return c.json({ error: "Invalid credentials" }, 401);

  // 3. Sign JWT
  const token = await sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
  );
  return c.json({ token });
};
