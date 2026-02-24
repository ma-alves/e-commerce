import { User } from "./user.model.ts";
import type { CreateUserInput, UpdateUserInput } from "./user.types.ts";
import { hashPassword } from "./auth.utils.ts";

export class UserService {
  // async create(data: CreateUserInput): Promise<User> {
  //   const existing = await User.findOne({ where: { email: data.email } });

  //   if (existing) {
  //     throw new Error("Email already in use");
  //   }

  //   const hashedPassword = await hashPassword(data.password);

  //   return User.create({
  //     ...data,
  //     password: hashedPassword,
  //   });
  // }

  async findAll(): Promise<User[]> {
    return User.findAll({
      attributes: { exclude: ["password"] },
    });
  }

  async findById(uuid: string): Promise<User> {
    const user = await User.findByPk(uuid, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async update(uuid: string, data: UpdateUserInput): Promise<User> {
    const user = await User.findByPk(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) {
        throw new Error("Email already in use");
      }
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    await user.update(data);
    return user;
  }

  async delete(uuid: string): Promise<void> {
    const user = await User.findByPk(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();
  }
}