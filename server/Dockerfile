# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the port Hono is listening on
EXPOSE 3000

# Run the app
CMD ["bun", "run", "./index.ts"]