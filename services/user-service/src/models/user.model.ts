import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../config/db.ts";
import type { UserInterface } from "../validation/types.ts";

// exclusivo daqui, utiliza Optional do sequelize
export type CreateUserInterface = Optional<UserInterface, "uuid" | "createdAt" | "updatedAt" | "role">

class User extends Model<UserInterface, CreateUserInterface> implements UserInterface {
  declare uuid: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "User" | "Admin";
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      allowNull: false,
      defaultValue: "User",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "users",
    timestamps: true,
  }
);

export { User };