import { describe, expect, it } from "bun:test";
import { app } from "../index";

const request = (path: string, init?: RequestInit) => app.request(path, init);

describe("API endpoint basic tests", () => {
  it("POST /auth/create-account should exist", async () => {
    const res = await request("/auth/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: "password123",
      }),
    });

    expect(res.status).not.toBe(404);
  });

  it("POST /auth/sign-in should exist", async () => {
    const res = await request("/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "does-not-exist@example.com",
        password: "wrong-password",
      }),
    });

    expect(res.status).not.toBe(404);
  });

  it("GET /stocks/open without auth should be 401", async () => {
    const res = await request("/stocks/open?symbol=AAPL", { method: "GET" });
    expect(res.status).toBe(401);
  });
});
