import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "@e-commerce/common/src/db.ts";
import type { OrderInterface, OrderStatus } from "../validation/types.ts";

// exclusivo daqui, utiliza Optional do sequelize
export type CreateOrderInterface = Optional<OrderInterface, "uuid" | "createdAt" | "updatedAt" | "status">

class Order extends Model<OrderInterface, CreateOrderInterface> implements OrderInterface {
  declare uuid: string;
  declare userId: string;
  declare status: OrderStatus;
  declare totalAmount: number;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Order.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "uuid",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "orders",
    timestamps: true,
  }
);

export { Order };
