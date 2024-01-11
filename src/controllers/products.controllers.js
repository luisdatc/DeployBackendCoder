import { productModel } from "../models/products.models.js";
import EError from "../services/errors/enum.js";
import CustomError from "../services/errors/CustomError.js";

export const getProducts = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  const pag = page ? page : 1;
  const lim = limit ? limit : 100;
  const ord = sort == "asc" ? 1 : -1;

  try {
    const products = await productModel.paginate(
      { filter: filter },
      { limit: lim, page: pag, sort: { price: ord } }
    );

    if (products.docs.length > 0) {
      return res.status(200).send(products);
    }

    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Productos no encontrados",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en consultar productos: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);

    if (product) {
      return res.status(200).send(product);
    }

    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Producto no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en consultar producto: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const postProduct = async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const userId = req.user._id; // Obtén el ID del usuario actual desde la sesión
  const userRole = req.user.role;

  try {
    const newProduct = await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      owner: userRole === "premium" ? userId : "admin", // Asignar el owner según el rol del usuario
    });

    if (newProduct) {
      return res.status(201).send(newProduct);
    }
    res.status(400).send({
      error: CustomError.createError({
        name: "ValidationError",
        message: "Error en crear producto",
        code: EError.VALIDATION_ERROR,
      }),
    });
  } catch (error) {
    if (error.code == 11000) {
      // Código para clave duplicada
      return res.status(400).send({
        error: CustomError.createError({
          name: "ValidationError",
          message: "Producto ya creado con clave duplicada",
          code: EError.VALIDATION_ERROR,
        }),
      });
    }
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en crear producto: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const putProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, code, price, stock, category } = req.body;

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      code,
      price,
      stock,
      category,
    });

    if (updatedProduct) {
      return res.status(200).send(updatedProduct);
    }

    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Producto no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en actualizar el producto: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (deletedProduct) {
      return res.status(200).send(deletedProduct);
    }

    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Producto no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en eliminar producto: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

//en los controllers normalmente se hace metodo http + modelo para refeerirse al nombre del controlador
