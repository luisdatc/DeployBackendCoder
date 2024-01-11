import mongoose from "mongoose";
import "dotenv/config";
import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

await mongoose.connect(process.env.MONGO_URL);

describe("Test CRUD del carrito en api/carts", function () {
  it("Ruta: api/carts metodo Post", async () => {
    const { ok } = await requester.post("/api/carts");

    expect(ok).to.be.ok;
  });
});

describe("Pruebas para la ruta /api/carts/:cid/products/:pid", () => {
  it("RUta: api/catrs metodo Post", async () => {
    
    const carritoId = "657789a13002fa8197732a2d";
    const productoId = "6502662a478875053062f17e";
    const cantidad = 1;

    const response = await requester
      .post(`/api/carts/${carritoId}/products/${productoId}`)
      .send({ quantity: cantidad });

    expect(response.status).to.equal(200);
  });
});
