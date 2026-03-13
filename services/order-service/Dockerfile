FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/common ./packages/common
COPY services/order-service ./services/order-service

RUN npm ci

EXPOSE 3001

CMD ["npm", "run", "dev", "-w", "@e-commerce/order-service"]
