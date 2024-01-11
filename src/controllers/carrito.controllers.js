import { cartModel } from "../models/cart.models.js";
import { productModel } from "../models/products.models.js";
import { ticketModel } from "../models/ticket.models.js";
import EError from "../services/errors/enum.js";
import {
  generateCartError,
  generateDatabaseError,

} from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.js";

export const getCarrito = async (req, res) => {
  const { limit } = req.query;
  try {
    const carts = await cartModel.find().limit(limit);
    res.status(200).send({ respuesta: "ok", mensaje: carts });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en consultar carritos: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const getCarritoById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartModel.findById(id);

    if (cart) {
      res.status(200).send({ respuesta: "OK", mensaje: cart });
    } else {
      res.status(404).send({
        error: CustomError.createError({
          name: "NotFoundError",
          message: "Carrito no encontrado",
          code: EError.NOT_FOUND_ERROR,
        }),
      });
    }
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en consultar el carrito: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const postCarrito = async (req, res) => {
  try {
    const cart = await cartModel.create({});
    res.status(200).send({ respuesta: "OK", mensaje: cart });
  } catch (error) {
    res.status(400).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en crear el carrito: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const postCarritoByProductId = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);

    if (!cart) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateCartError(cid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const product = await productModel.findById(pid);

    if (!product) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateProductNotFoundError(pid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const indice = cart.products.findIndex((prod) => prod.id_prod === pid);

    if (indice !== -1) {
      cart.products[indice].quantity = quantity;
    } else {
      cart.products.push({ id_prod: pid, quantity: quantity });
    }

    const response = await cartModel.findByIdAndUpdate(cid, cart);

    res.status(200).send({
      respuesta: "OK",
      mensaje: "Producto agregado al carrito",
      carrito: response, // Opcional: puedes enviar el carrito actualizado como respuesta
    });
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      res.status(404).send({
        error: error,
      });
    } else {
      res.status(500).send({
        error: CustomError.createError({
          name: "ServerError",
          message: `Ha ocurrido un error en el servidor: ${error.message}`,
          code: EError.INTERNAL_SERVER_ERROR,
          cause: error,
        }),
      });
    }
  }
};

export const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartModel.findById(id);

    if (!cart) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateCartError(id),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    cart.products = [];
    await cart.save();

    res.status(200).send({
      respuesta: "OK",
      mensaje: "Productos eliminados del carrito",
      carrito: cart,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      res.status(404).send({
        error: error,
      });
    } else {
      res.status(500).send({
        error: CustomError.createError({
          name: "ServerError",
          message: `Ha ocurrido un error en el servidor: ${error.message}`,
          code: EError.INTERNAL_SERVER_ERROR,
          cause: error,
        }),
      });
    }
  }
};

export const putCarritoByProducId = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);

    if (!cart) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateCartError(cid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const product = await productModel.findById(pid);

    if (!product) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateProductNotFoundError(pid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const indice = cart.products.findIndex(
      (prod) => prod.id_prod._id.toString() === pid
    );

    if (indice !== -1) {
      cart.products[indice].quantity = quantity;
    } else {
      cart.products.push({ id_prod: pid, quantity: quantity });
    }

    await cart.save();

    res.status(200).send({
      respuesta: "OK",
      mensaje: "Carrito actualizado",
      carrito: cart,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      res.status(404).send({
        error: error,
      });
    } else {
      res.status(500).send({
        error: CustomError.createError({
          name: "ServerError",
          message: `Ha ocurrido un error en el servidor: ${error.message}`,
          code: EError.INTERNAL_SERVER_ERROR,
          cause: error,
        }),
      });
    }
  }
};

export const deleteProductById = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateCartError(cid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const product = await productModel.findById(pid);
    if (!product) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateProductNotFoundError(pid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const index = cart.products.findIndex(
      (prod) => prod.id_prod._id.toString() === pid
    );
    if (index !== -1) {
      cart.products.splice(index, 1);
    } else {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateProductNotFoundError(pid),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    await cart.save();

    res.status(200).send({ respuesta: "OK", mensaje: "Product removed" });
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      res.status(404).send({
        error: error,
      });
    } else {
      res.status(500).send({
        error: CustomError.createError({
          name: "ServerError",
          message: `Ha ocurrido un error en el servidor: ${error.message}`,
          code: EError.INTERNAL_SERVER_ERROR,
          cause: error,
        }),
      });
    }
  }
};

export const putCarrito = async (req, res) => {
  const { cid } = req.params;
  const productsArray = req.body.products;

  try {
    const cart = await cartModel.findById(cid);

    if (!cart) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateDatabaseError(`Carrito con ID ${cid} no encontrado`),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    if (!Array.isArray(productsArray)) {
      throw CustomError.createError({
        name: "BadRequestError",
        message: generateDatabaseError(
          "Los productos deben estar en un arreglo"
        ),
        code: EError.BAD_REQUEST_ERROR,
      });
    }

    const updatedProducts = [];

    for (let prod of productsArray) {
      const product = await productModel.findById(prod.id_prod);

      if (!product) {
        throw CustomError.createError({
          name: "NotFoundError",
          message: generateProductNotFoundError(prod.id_prod),
          code: EError.NOT_FOUND_ERROR,
        });
      }

      const existingProductIndex = cart.products.findIndex(
        (cartProduct) => cartProduct.id_prod.toString() === prod.id_prod
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = prod.quantity;
      } else {
        cart.products.push({
          id_prod: prod.id_prod,
          quantity: prod.quantity,
        });
      }

      updatedProducts.push({
        id_prod: prod.id_prod,
        quantity: prod.quantity,
      });
    }

    await cart.save();

    return res.status(200).json({
      respuesta: "OK",
      mensaje: "Carrito actualizado exitosamente",
      productosActualizados: updatedProducts,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      res.status(404).json({
        error: error,
      });
    } else {
      res.status(500).json({
        error: CustomError.createError({
          name: "ServerError",
          message: `Ha ocurrido un error en el servidor: ${error.message}`,
          code: EError.INTERNAL_SERVER_ERROR,
          cause: error,
        }),
      });
    }
  }
};

export const postCompra = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartModel.findById(cartId).populate("items.product");
    if (!cart) {
      throw CustomError.createError({
        name: "NotFoundError",
        message: generateDatabaseError(`Carrito con ID ${cartId} no encontrado`),
        code: EError.NOT_FOUND_ERROR,
      });
    }

    const productsNotProcessed = [];

    for (const item of cart.items) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      if (product.stock >= requestedQuantity) {
        product.stock -= requestedQuantity;
        await product.save();
      } else {
        productsNotProcessed.push(product._id);
      }
    }

    cart.items = cart.items.filter(
      (cartItem) => !productsNotProcessed.includes(cartItem.product._id)
    );
    await cart.save();

    const ticket = new ticketModel({
      amount: cart.total,
      purchaser: cart.userEmail,
    });
    await ticket.save();

    return res.status(200).json({
      message: "Compra finalizada exitosamente",
      productsNotProcessed: productsNotProcessed,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      res.status(404).json({
        error: error,
      });
    } else {
      res.status(500).json({
        error: CustomError.createError({
          name: "ServerError",
          message: `Ha ocurrido un error en el servidor: ${error.message}`,
          code: EError.INTERNAL_SERVER_ERROR,
          cause: error,
        }),
      });
    }
  }
};