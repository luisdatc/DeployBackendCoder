import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
import initializePassport from "./config/passport.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.routes.js";
import nodemailer from "nodemailer";
import { __dirname } from "./path.js";
import { addLogger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const whiteList = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "https://comic-store-back.netlify.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) != -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso Denegado"));
    }
  },
  credentials: true,
};

const app = express();
const PORT = 8080;

//Conexion a la Base de Datos
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

//MIDDLEWARE
app.use(express.json());

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser(process.env.SIGNED_COOKIE)); //la cookie esta firmada

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true, //estable la conexxion mediante url
        useUnifiedTopology: true, //para conectarse al controlador de la basse de ddatos y manejo de cluster de manera dinamicca
      },
      ttl: 60, //duracion de la sesion en segundos en la base de datos
    }),
    secret: process.env.SESSION_SECRET,
    resave: /* true */ false, //fuerzo a que se intente a guardar a oesar de no tener modificacion en los datos
    saveUninitialized: /* true */ false, //fuerzo a guardar la sesion a pesar de no tener ningun dato
  })
);
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.resolve(__dirname, "./views")); //resuelve rutas absolutas a travez de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.login === true; // Define una variable local en res.locals
  next();
});

//Routes
app.use("/", router);

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentacion Api Comic Store",
      description: "Proyecto realizado para curso Backend de Coder House",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`], //**indica sub carpeta
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
