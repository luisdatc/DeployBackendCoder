import mongoose from "mongoose";
import "dotenv/config";
import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/api");

await mongoose.connect(process.env.MONGO_URL);
let token = null;

describe("Test CRUD de productos en la ruta api/products", function () {
  it("iniciar sesion con post a traves de /sessions/login", async function () {
    this.timeout(5000);
    const user = {
      email: "luisct91@gmail.com",
      password: "12345",
    };
    const { _body, ok } = await requester.post("/sessions/login").send(user);
    token = _body.token;
    expect(ok).to.be.ok;
  });

  it("Ruta: api/products metodo Get", async () => {
    const { ok } = await requester.get("/products");

    expect(ok).to.be.ok;
  });

  it("Ruta: api/products/id metodo Get", async () => {
    const id = "6502662a478875053062f17e";
    const { ok } = await requester.get(`/products/${id}`);

    expect(ok).to.be.ok;
  });

  it("Ruta: api/products metodo Post", async () => {
    const newProduct = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      price: 20.99,
      stock: 100,
      category: "Comic",
      code: "54341314fsbvavf",
    };

    const response = await requester
      .post("/products")
      .send(newProduct)
      .set("Authorization", `Bearer ${token}`);

    expect(response).to.be.ok;
  });

  it("Ruta: api/products metodo Put", async () => {
    const id = "6502662a478875053062f17e";
    const updateProduct = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      price: 25.99,
      stock: 100,
      category: "Coic",
      code: "54341314fsf",
    };

    const response = await requester
      .put(`/products/${id}`)
      .send(updateProduct)
      .set("Authorization", `Bearer ${token}`);

    expect(response).to.be.ok;
  });

  it("Ruta: api/products/id metodo Delete", async () => {
    const id = "6502662a478875053062f17e";

    const response = await requester
      .delete(`/products/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response).to.be.ok;
  });
});

//TESTING CON CHAI

/*describe("Test CRUD products con chai en api/products", function () {
  it("Obtener todos los productos mediante el metodo Get", async () => {
    const products = await productModel.find();

    expect(Array.isArray(products)).to.be.ok;
  });

  it("Obtener un producto mediante el metodo Get", async () => {
    const products = await productModel.findById("6502662a478875053062f17e");

    expect(products).to.have.property("_id");
  });

  it("Crear un nuevo Producto mediante el metodo Post", async () => {
    const newProduct = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      price: 20.99,
      stock: 100,
      category: "Comic",
      code: "54341314fsf",
    };

    const response = await productModel.create(newProduct);

    expect(response).to.have.property("_id");
  });

  it("Actualizar un Producto mediante el metodo Put", async () => {
    const updateProduct = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      price: 25.99,
      stock: 100,
      category: "Comic",
      code: "54341314fsf",
    };

    const prod = await productModel.findByIdAndUpdate(
      "658202051e24b435ff5eb2a4",
      updateProduct
    );

    expect(prod).to.have.property("_id");
  });

  it("Eliminar un producto mediante metodo Delete", async () => {
    const result = await productModel.findByIdAndDelete(
      "658202051e24b435ff5eb2a4"
    );

    expect(result).to.be.ok;
  });
}); */
