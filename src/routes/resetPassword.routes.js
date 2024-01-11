import Router from "express";
import {
  resetPasswordConfirmPost,
  resetPasswordPost,
} from "../controllers/resetPassword.controller.js";

const resetPasswordRouter = Router();

// Ruta para solicitar restablecimiento de contraseña
resetPasswordRouter.post("/", resetPasswordPost);

// Ruta para confirmar el restablecimiento de contraseña
resetPasswordRouter.post("/:token", resetPasswordConfirmPost);

export default resetPasswordRouter;
