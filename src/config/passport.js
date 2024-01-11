import local from "passport-local"; // se importa la estrategia
import GithubStrategy from "passport-github2";
import passport from "passport";
import jwt from "passport-jwt";
import "dotenv/config";

import { createHash, validatePassword } from "../utils/bcrypt.js";
import { userModel } from "../models/users.models.js";

//estrategia a utilizar
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt; // para extraer de las cookies el token

const initializePassport = () => {
  const cookieExtractor = (req) => {
    const token = req.headers.authorization ? req.headers.authorization : {};

    console.log("cookieExtractor", token);

    return token;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //el token va a venir desde la funcion cookieExtractor
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        //jwt_payload = info del token(en este caso datos del cliente)
        try {
          console.log("JWT", jwt_payload);
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        // Registro del usuario
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: email });
          if (user) {
            // Si el usuario existe, devuelves un error
            return done(null, false);
          }

          const passwordHash = createHash(password);

          const userCreado = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            age: age,
            email: email,
            password: passwordHash,
          });

          return done(null, userCreado);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false);
          }

          if (validatePassword(password, user.password)) {
            return done(null, user);
          }

          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET_CLIENT,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });

          if (user) {
            done(null, false);
          } else {
            const userCreado = await userModel.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 18, //por defecto ya que git hub no pide edad,
              password: createHash(profile._json.email + profile._json.name),
            });
            done(null, userCreado);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  //se inicializa la sesion del usser
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
