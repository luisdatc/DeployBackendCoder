import { Router } from "express";
import {
  getUsers,
  getUserbyId,
  putUser,
  deleteUser,
  uploadDocument,
} from "../controllers/users.controllers.js";

import { authorization, passportError } from "../utils/messageError.js";
import multer from "multer";

const userRouter = Router();

userRouter.get("/", passportError("jwt"), authorization("admin"), getUsers);

userRouter.get(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  getUserbyId
);

userRouter.put("/:id", passportError("jwt"), authorization("admin"), putUser);

userRouter.delete(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  deleteUser
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.body; // Asegúrate de enviar el tipo de archivo en la solicitud
    let folder;
    if (type === "profile") {
      folder = "profiles";
    } else if (type === "product") {
      folder = "products";
    } else {
      folder = "documents";
    }
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

userRouter.post("/:uid/documents", upload.array("files"), uploadDocument);

export default userRouter;
