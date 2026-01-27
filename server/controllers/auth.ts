import type { Context } from "hono";
import { sign } from "hono/jwt";
import db from "../db";

export const createAccount = async (c: Context) => {
  const { email, password } = await c.req.json();

  const hashedPassword = await Bun.password.hash(password);

  try {
    const [user] = await db`
      INSERT INTO users (email, password) 
      VALUES (${email}, ${hashedPassword}) 
      RETURNING id, email
    `;
    return c.json({ user, message: "User created successfully" }, 201);
  } catch (e) {
    return c.json({ error: "User already exists or DB error" }, 400);
  }
};

export const signIn = async (c: Context) => {
  const { email, password } = await c.req.json();

  try {
    const [user] = await db`SELECT * FROM users WHERE email = ${email}`;

    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const isMatch = await Bun.password.verify(password, user.password);
    if (!isMatch) return c.json({ error: "Invalid credentials" }, 401);

    const token = await sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
    );
    return c.json({ token });
  } catch (e) {
    return c.json({ error: "Server error" }, 500);
  }
};
