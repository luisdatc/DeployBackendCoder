import crypto from "crypto";
import { userModel } from "../models/users.models.js";
import nodemailer from "nodemailer";
import { createHash } from "../utils/bcrypt.js";

export const resetPasswordPost = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "correomcoc@gmail.com",
      pass: process.env.PASSWORD_EMAIL,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const { email } = req.body;

    // Buscar al usuario por correo electrónico
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Generar y guardar token de restablecimiento de contraseña
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
    await user.save();

    // Enviar correo electrónico con el enlace de restablecimiento
    /* const resetLink = `http://localhost:5173/reset-password/${resetToken}`; */
        const resetLink = `https://comic-store-back.netlify.app//reset-password/${resetToken}`;
    
    const mailOptions = {
      from: "correomcoc@gmail.com", // Reemplaza con tu dirección de correo electrónico
      to: email,
      subject: "Restablecimiento de Contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer Contraseña</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "Correo electrónico enviado con instrucciones para restablecer la contraseña",
    });
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
};

export const resetPasswordConfirmPost = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Buscar al usuario por el token de restablecimiento de contraseña
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).send({ message: "Token no válido o expirado" });
    }

    // Hash de la nueva contraseña
    const newPasswordHash = createHash(newPassword);

    // Actualizar la contraseña y limpiar los campos de restablecimiento
    user.password = newPasswordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
};
