# Agent Guidelines for E-Commerce Monorepo

## Project Structure

```
e-commerce/
├── packages/
│   └── common/          # Shared utilities (logger, db, env, errors)
├── services/
│   ├── api-gateway/     # Express gateway with proxy routing
│   ├── user-service/     # User authentication and management
│   └── order-service/    # Order processing
├── tsconfig.base.json   # Shared TypeScript config
└── compose.yaml         # Docker services (postgres, rabbitmq)
```

## Build, Lint, and Test Commands

### Running Services

```bash
# From workspace root or individual service directories
npm run dev          # Development mode with hot reload (tsx watch)
npm run start        # Production start (tsx)

# Individual services
cd services/user-service && npm run dev
cd services/order-service && npm run dev

# Docker Compose (starts all services)
docker compose up -d
docker compose down  # Stop all services
```

### TypeScript Compilation

```bash
# Type check all projects (from root)
npx tsc --build

# Type check specific service
cd services/user-service && npx tsc --noEmit
```

### Testing

No test framework is currently configured. Tests should use Vitest (preferred) or Jest.

```bash
# Install test framework
npm install -D vitest @vitest/coverage-v8

# Run single test file
npx vitest run src/services/user.service.test.ts

# Run tests in watch mode
npx vitest src/services/user.service.test.ts
```

## Code Style Guidelines

### TypeScript Configuration

- `strict: true` is enabled globally
- Use explicit types; avoid `any`
- Use `type` for type aliases, `interface` for object shapes
- Always import types explicitly: `import type { User }`

### Imports

```typescript
// Types (explicit)
import type { Request, Response, NextFunction } from "express";

// Named imports for utilities
import { createLogger } from "@e-commerce/common/src/logger.ts";

// Extensions required in imports (.ts)
import userRouter from "./routes/user.route.ts";
import { UserService } from "../services/user.service.ts";

// Default imports for Express
import express from "express";
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `user.route.ts`, `auth.middleware.ts` |
| Classes | PascalCase | `UserService`, `AuthController` |
| Functions/variables | camelCase | `getUsersController`, `findAll` |
| Types/interfaces | PascalCase | `UserInterface`, `CreateUserInput` |
| Constants | SCREAMING_SNAKE_CASE | `JWT_SECRET_KEY` |
| Enums | PascalCase | `Role.Admin` |
| Routes | lowercase, kebab | `/api/v1/users` |

### Service Layer Pattern

```typescript
// services return domain models or throw Error
export class UserService {
  async findById(uuid: string): Promise<User> {
    const user = await User.findByPk(uuid);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
```

### Controller Layer Pattern

```typescript
// Controllers handle HTTP response/status
export const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userService.findById(req.params.uuid as string);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: getErrorMessage(error) });
  }
};
```

### Error Handling

- Use `getErrorMessage()` from `@e-commerce/common/src/http-error.ts` to extract error messages
- Services throw `Error` with descriptive string messages
- Controllers catch errors and map to appropriate HTTP status codes
- Use Zod for request validation with `validateData` middleware

```typescript
// Middleware usage
userRouter.put(
  "/:uuid/update",
  authenticated,
  validateData(updateUserSchema),
  updateUserController
);
```

### Database Models (Sequelize)

```typescript
export type CreateUserInterface = Optional<UserInterface, "uuid" | "createdAt" | "updatedAt">

class User extends Model<UserInterface, CreateUserInterface> {
  declare uuid: string;
  declare name: string;
  // ...
}

User.init(
  {
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    // ...
  },
  { sequelize, modelName: "users", timestamps: true }
);
```

### Environment Variables

- Use Zod schema validation in `packages/common/src/env.ts`
- All environment variables validated at startup
- Constants typed via `z.infer<typeof schema>`

```typescript
const envSchema = z.object({
  POSTGRES_DB: z.string(),
  JWT_SECRET_KEY: z.string().min(32),
  USER_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(3001),
});
```

### Logging

- Use `createLogger()` from `@e-commerce/common/src/logger.ts`
- Pino with pretty printing in development

```typescript
const logger = createLogger("[user-service]");
logger.info(`Server running at http://localhost:${port}`);
```

### Authentication Middleware

- `authenticated`: Validates JWT or trusts API Gateway headers
- `authorized(roles)`: Checks user role permissions
- Extend Express Request type for `req.user`

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
```

## Adding New Services

1. Create directory under `services/`
2. Add to `package.json` workspaces
3. Add to root `tsconfig.json` references
4. Add to `compose.yaml` with health checks
5. Import shared utilities from `@e-commerce/common`

## Common Patterns

- Express 5 with async route handlers
- JWT tokens for inter-service communication
- Helmet for security headers
- CORS configuration in API Gateway
- Environment-aware `.env` loading via common package
