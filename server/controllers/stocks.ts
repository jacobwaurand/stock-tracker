import type { Context } from "hono";

export const getOpeningPrice = async (c: Context) => {
  const symbol = c.req.query("symbol");

  if (!symbol) {
    return c.json({ error: "Symbol query parameter is required" }, 400);
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`,
  );

  const data: any = await response.json();

  return c.json({
    symbol: symbol.toUpperCase(),
    openingPrice: data.o,
    timestamp: Date.now(),
  });
};
