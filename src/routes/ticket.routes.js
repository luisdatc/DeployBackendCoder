import { Router } from "express";
import { postCompra } from "../controllers/ticket.controllers";

const ticketRouter = Router();

ticketRouter.post("/:cid/purchase", postCompra);

export default ticketRouter;
