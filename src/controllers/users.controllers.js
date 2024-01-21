import { userModel } from "../models/users.models.js";
import CustomError from "../services/errors/CustomError.js";
import EError from "../services/errors/enum.js";
import { generateUserError } from "../services/errors/info.js";
import nodemailer from "nodemailer";
import { sendInactiveAccountEmail } from "../utils/DeleteAcountMail.js";

export const getUsers = async (req, res) => {
  try {
    const user = await userModel.find();

    if (user) {
      return res.status(200).send(user);
    }
    res.status(404).send(generateUserError({}));
  } catch (error) {
    res.status(500).send({
      error: generateDatabaseError(`Error en consultar el usuario ${error}`),
    });
  }
};

export const getUserbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = await userModel.findById(id);

    if (userId) {
      return res.status(200).send(userId);
    }
    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Usuario no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en consultar usuario: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const putUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });

    if (updatedUser) {
      return res.status(200).send(updatedUser);
    }
    res.status(404).send({
      error: CustomError.createError({
        name: "NotFoundError",
        message: "Usuario no encontrado",
        code: EError.NOT_FOUND_ERROR,
      }),
    });
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en actualizar el usuario: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(200).send({ user: deletedUser });
    } else {
      res.status(404).send({
        error: CustomError.createError({
          name: "NotFoundError",
          message: "Usuario no encontrado",
          code: EError.NOT_FOUND_ERROR,
        }),
      });
    }
  } catch (error) {
    res.status(500).send({
      error: CustomError.createError({
        name: "DatabaseError",
        message: `Error en eliminar usuario: ${error.message}`,
        code: EError.DATABASE_ERROR,
        cause: error,
      }),
    });
  }
};

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

export const sendPasswordResetEmail = async (userEmail) => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Guarda resetToken en la base de datos junto con el correo del usuario y una marca de tiempo

/*   const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
 */      const resetLink = `https://comic-store-back.netlify.app//reset-password/${resetToken}`;
  
  const mailOptions = {
    from: "correomcoc@gmail.com",
    to: userEmail,
    subject: "Restablecimiento de Contraseña",
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer Contraseña</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const getUserByEmail = async (email) => {
  return userModel.findOne({ email });
};

export const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { files } = req;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    files.forEach((file) => {
      user.documents.push({
        name: file.originalname,
        reference: `uploads/documents/${file.filename}`,
      });
    });

    await user.save();

    res.status(200).json({ message: "Documentos subidos con éxito" });
  } catch (error) {
    console.error("Error al subir documentos:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    // se traen los usuarios inactivos de d¿2 dias
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const inactiveUsers = await userModel.find({
      last_connection: { $lt: twoDaysAgo },
    });

    // Elimina los usuarios inactivos
    await userModel.deleteMany({
      _id: { $in: inactiveUsers.map((user) => user._id) },
    });

    // Envía correos electrónicos informando a los usuarios eliminados
    inactiveUsers.forEach(async (user) => {
      await sendInactiveAccountEmail(user.email);
    });

    res
      .status(200)
      .send({ message: "Usuarios inactivos eliminados con éxito" });
  } catch (error) {
    res.status(500).send({
      error: `Error al eliminar usuarios inactivos: ${error.message}`,
    });
  }
};

export const getNombreEmailUsuarios = async (req, res) => {
  try {
    const users = await userModel.find({}, { first_name: 1, email: 1, _id: 0 });
    res.status(200).send(users);
  } catch (error) {
    res
      .status(500)
      .send({ error: `Error al obtener los usuarios: ${error.message}` });
  }
};
