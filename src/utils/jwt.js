import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  /* 
1° parametro: objeto asociado al token (seria el usuario)
2° parametro: clave privada para el cifrado
3° parametro: tiempo de expiracion

*/

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return token;
};

export const authToken = (req, res, next) => {
  //consultar al header para obtener al token
  const authHeader = req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Usuario no autenticado" });
  }

  const token = authHeader.split(" ")[1]; //obtengo el token separando el bearer

  jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
    if (error) {
      return res
        .status(403)
        .send({ error: "Usuario no autorizado token invalido" });
    }
  });

  //usuario valido
  req.user = credential.user;
  next();
};
