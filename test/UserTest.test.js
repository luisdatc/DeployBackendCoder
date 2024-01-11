import mongoose from "mongoose";
import { userModel } from "../src/models/users.models.js";
import Assert from "assert";
import { beforeEach } from "mocha";
import "dotenv/config";

const assert = Assert.strict;

await mongoose.connect(process.env.MONGO_URL);

describe("Test CRUD de usuario en la ruta api/users", function () {
  // antes de arrancar todo el test
  before(() => {
    console.log("Arrancando el Test");
  });

  //antes de arracar cada uno de los test

  beforeEach(() => {
    console.log("Comienza el test");
  });

  it("Obtener todos los usuarios mediante el metodo Get", async () => {
    const users = await userModel.find();

    assert.strictEqual(Array.isArray(users), true);
  });

  it("Obtener un usuario mediante el metodo Get", async () => {
    const user = await userModel.findById("657785ebae3c8a8c05484cac");

    assert.strictEqual(typeof user, "object");
    assert.ok(user._id);
  });

  it("Crear un nuevo usuario mediante el metodo POst", async () => {
    const newuser = {
      first_name: "Dani",
      last_name: "Castellano",
      email: "prueba333@prueba.com",
      password: "@@@ojegijlf",
      age: 55,
    };

    const user = await userModel.create(newuser);

    assert.ok(user._id);
  });

  it("Actualizar un usuario mediante el metodo Put", async () => {
    const updateUser = {
      first_name: "Daniel",
      last_name: "Torres",
      email: "prueba3555@prueba.com",
      password: "@@@ojegijlf",
      age: 55,
    };

    const user = await userModel.findByIdAndUpdate(
      "650a0fb609e7ecaa08c99bc1",
      updateUser
    );

    assert.ok(user._id);
  });

  it("Eliminar un usuario mediante el metodo Delete", async () => {
    const result = await userModel.findByIdAndDelete(
      "650b39c4fdf25469dd20e8a3"
    );

    assert.strictEqual(typeof result, "object");
  });
});
