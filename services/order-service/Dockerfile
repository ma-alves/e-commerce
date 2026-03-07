# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy workspace packages
COPY packages/common ./packages/common
COPY services/order-service ./services/order-service

# Install dependencies
RUN npm ci

# Build TypeScript
RUN npm run build -w @e-commerce/order-service || true

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy workspace packages
COPY packages/common ./packages/common
COPY services/order-service ./services/order-service

# Install production dependencies only
RUN npm ci --omit=dev

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the service
CMD ["npm", "start", "-w", "@e-commerce/order-service"]
