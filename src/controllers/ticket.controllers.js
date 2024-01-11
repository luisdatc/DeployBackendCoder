import { cartModel } from "../models/cart.models";
import { ticketModel } from "../models/ticket.models";
import { productModel } from "../models/products.models";

export const postCompra = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartModel.findById(cartId).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const productsNotProcessed = []; // aca se almacenan los productos que no se pudieron procesar

    for (const item of cart.items) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      if (product.stock >= requestedQuantity) {
        // El producto tiene suficiente stock, restarlo
        product.stock -= requestedQuantity;
        await product.save();
      } else {
        // si el producto no tiene suficiente stock se almacenan en los no procesados
        productsNotProcessed.push(product._id);
      }
    }

    // se actualiza el carrito con los productos no procesados
    cart.items = cart.items.filter(
      (cartItem) => !productsNotProcessed.includes(cartItem.product._id)
    );
    await cart.save();

    // se crea un ticket con los datos de la compra
    const ticket = new ticketModel({
      amount: cart.total, // Supongo que el carrito tiene un campo total
      purchaser: cart.userEmail, // O donde se almacena el correo del usuario
    });
    await ticket.save();

    return res.status(200).json({
      message: "Compra finalizada exitosamente",
      productsNotProcessed: productsNotProcessed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al procesar la compra" });
  }
};
