const { captureRejectionSymbol } = require("supertest/lib/test");
const { crearProducto, listarProducto, obtenerVersion } = require("./inventoryService");
beforeEach(() => {
  jest.resetModules();
});
test("crea un producto válido con stock inicial 0 si no se define", () => {
  const { crearProducto } = require("./inventoryService");
  const prod = crearProducto({
    sku: "A-001",
    nombre: "Cable HDMI",
  });
  expect(prod.id).toBe(1);
  expect(prod.sku).toBe("A-001");
  expect(prod.nombre).toBe("Cable HDMI");
  expect(prod.stock).toBe(0);
});
test("lanza error si falta sku o nombre", () => {
  const { crearProducto } = require("./inventoryService");
  expect(() => crearProducto({ sku: "A-002" })).toThrow(
    "SKU y nombre son obligatorios",
  );
  expect(() => crearProducto({ sku: "Mose" })).toThrow(
    "SKU y nombre son obligatorios",
  );
});

test("obtenerVersion retorna la versión de la API", () => {
  const { obtenerVersion } = require("./inventoryService");
  const resultado = obtenerVersion();
  expect(resultado).toEqual({ version: "1.0.0" });
});
