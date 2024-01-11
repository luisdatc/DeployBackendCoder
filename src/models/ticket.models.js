import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

// Agregamos un pre-save middleware para generar el código automáticamente
ticketSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = uuidv4();
  }
  next();
});

export const ticketModel = model("Ticket", ticketSchema);
