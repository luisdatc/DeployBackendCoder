import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { cartModel } from "./cart.models.js";
import crypto from "crypto";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
    index: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: [{ name: String, reference: String }],
  last_connection: {
    type: Date,
    default: null,
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
};

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      this.generatePasswordReset();
    }

    if (!this.cart) {
      const newCarrito = await cartModel.create({});
      this.cart = newCarrito._id;
    }
  } catch (error) {
    next(error);
  }
});

export const userModel = model("users", userSchema);
