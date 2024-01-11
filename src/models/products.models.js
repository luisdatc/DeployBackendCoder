import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnails: [],
    status: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

productSchema.plugin(mongoosePaginate);

export const productModel = model("products", productSchema);

/* 
/api/products/{id}:
    get:
      summary: Obtiene un producto mediante su Id.
      parameters:
        - in: path
          name: id
          required: true
          type: String
          minimun: 1
      tags:
        - Productos
      responses:
        "200":
          description: Producto obtenido correctamente.
          content:
            aplication/json:
              schema:
                type: array
        "500":
          description: Error interno del servidor */