import { User } from "./user.model.ts";
import { authenticate, generateToken, hashPassword } from "./auth.utils.ts";
import type { CreateUserInput, LoginUserInput } from "./user.types.ts";

// substituir por zod
interface AuthResponse {
  token: string;
  user: Omit<User, "password">;
}

export class AuthService {
  async register(data: CreateUserInput): Promise<AuthResponse> {
    const existing = await User.findOne({ where: { email: data.email } });

    if (existing) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const token = await generateToken({ uuid: user.uuid, role: user.role });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return { token, user: userWithoutPassword as Omit<User, "password"> };
  }

  async login(data: LoginUserInput): Promise<AuthResponse> {
    const token = await authenticate(data.email, data.password);

    const user = await User.findOne({
      where: { email: data.email },
      attributes: { exclude: ["password"] },
    });

    // authenticate() já valida existência, então user nunca será null aqui
    return { token, user: user! as Omit<User, "password"> };
  }

  async refreshToken(uuid: string): Promise<Pick<AuthResponse, "token">> {
    const user = await User.findByPk(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    const token = await generateToken({ uuid: user.uuid, role: user.role });

    return { token };
  }
}