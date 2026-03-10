# Build stage
FROM node:23-alpine AS builder

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
FROM node:23-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy workspace packages
COPY packages/common ./packages/common
COPY services/order-service ./services/order-service


RUN npm ci

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start", "-w", "@e-commerce/order-service"]
