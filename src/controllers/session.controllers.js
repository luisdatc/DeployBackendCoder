import { generateToken, authToken } from "../utils/jwt.js";

export const postLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ mensaje: "Usuario inválido" });
    }

    // Actualiza last_connection al momento del login
    req.user.last_connection = new Date();
    await req.user.save();

    const token = generateToken(req.user);

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
  }
};

export const postRegister = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({ mensaje: "Usuario ya existente" });
    }

    res.status(200).send({ mensaje: "Usuario registrado" });
  } catch (error) {
    res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
  }
};

export const getGithub = async (req, res) => {
  res.status(200).send({ mensaje: "Usuario registrado" });
};

export const getGihubCallback = async (req, res) => {
  req.session.user = req.user;
  res.status(200).send({ mensaje: "Usuario logueado" });
};

export const getLogout = async (req, res) => {
  try {
    // Actualiza last_connection al momento del logout
    req.user.last_connection = new Date();
    await req.user.save();

    res.clearCookie("jwtCookie");
    res.status(200).send({ resultado: "Usuario deslogueado" });
  } catch (error) {
    res.status(500).send({ mensaje: `Error al desloguear usuario ${error}` });
  }
};
