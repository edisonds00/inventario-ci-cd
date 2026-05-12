const request = require("supertest");
const app = require("./app");
test("POST /api/productos crea un producto válido", async () => {
  const respuesta = await request(app)
    .post("/api/productos")
    .send({ sku: "A-003", nombre: "Teclado", stock: 5 });
  expect(respuesta.status).toBe(201);
  expect(respuesta.body.data.sku).toBe("A-003");
  expect(respuesta.body.data.stock).toBe(5);
});
test("POST /api/ productos devuelve 400 si faltan campos", async () => {
  const respuesta = await request(app)
    .post("/api/productos")
    .send({ sku: "SIN-NOMBRE" });
  expect(respuesta.status).toBe(400);
  expect(respuesta.body.error).toBe("VALIDATION_ERROR");
});
