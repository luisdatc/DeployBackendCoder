import { Router } from "express";
import {
  getCarrito,
  getCarritoById,
  postCarrito,
  postCarritoByProductId,
  deleteById,
  putCarritoByProducId,
  deleteProductById,
  putCarrito,
  postCompra,
} from "../controllers/carrito.controllers.js";

const cartsRouter = Router();

cartsRouter.get("/", getCarrito);
cartsRouter.post("/", postCarrito);/* esta */

cartsRouter.get("/:cid", getCarritoById);
cartsRouter.put("/:cid", putCarrito);

cartsRouter.delete("/:id", deleteById);

cartsRouter.post("/:cid/products/:pid", postCarritoByProductId);
cartsRouter.delete("/:cid/products/:pid", deleteProductById);
cartsRouter.put("/:cid/products/:pid", putCarritoByProducId);

cartsRouter.post("/:cid/purchase", postCompra);



export default cartsRouter;
