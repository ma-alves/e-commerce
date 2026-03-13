FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/common ./packages/common
COPY services/user-service ./services/user-service

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev", "-w", "@e-commerce/user-service"]
