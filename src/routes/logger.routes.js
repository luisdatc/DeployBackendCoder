import { Router } from "express";
import { addLogger } from "../utils/logger.js";

const loggerRouter = Router();

loggerRouter.use(addLogger);

loggerRouter.get("/fatal", (req, res) => {
  req.logger.fatal("Hola fatal");
  res.send("Hola mundo");
});

loggerRouter.get("/error", (req, res) => {
  req.logger.error("Hola error");
  res.send("Hola mundo");
});

loggerRouter.get("/warning", (req, res) => {
  req.logger.warning("Hola warning");
  res.send("Hola mundo");
});

loggerRouter.get("/info", (req, res) => {
  req.logger.info("Hola info");
  res.send("Hola mundo");
});

loggerRouter.get("/debug", (req, res) => {
  req.logger.debug("Hola debug");
  res.send("Hola mundo");
});

loggerRouter.get("/http", (req, res) => {
  req.logger.http("Hola http");
  res.send("Hola mundo");
});
export default loggerRouter;
