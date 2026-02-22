export interface UserInterface {
  uuid: string;
  name: string;
  email: string;
  password: string;
  role: "User" | "Admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: "User" | "Admin";
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: "User" | "Admin";
}