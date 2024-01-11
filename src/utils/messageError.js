import passport from "passport";

//funcion general para retornar errores en las estrategas de passport

export const passportError = (strategy) => {
  //enviar estrategia sea local, github o jwt

  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error); //la funcion que me llame maneje como va a responder ante mi error
      }

      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next); //esto porque me va a llamar un middleware
  };
};

//establezco rol y capacidad
export const authorization = (rol) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "Usuario no autorizado" });
    }

    if (req.user.user.rol != rol) {
      return res
        .status(403)
        .send({ error: "usuario no tiene los permisos necesarios" });
    }
    next()
  };
};
