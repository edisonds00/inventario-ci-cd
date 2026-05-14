const { captureRejectionSymbol } = require("supertest/lib/test");
const { crearProducto, listarProducto, obtenerVersion, validarProducto, formatearProducto } = require("./inventoryService");
beforeEach(() => {
  jest.resetModules();
});

test("crea un producto válido con stock inicial 0 si no se define", () => {
  const { crearProducto } = require("./inventoryService");
  const prod = crearProducto({
    sku: "A-001",
    nombre: "Cable HDMI",
  });
  //expect(prod.id).toBe(1);
  expect(prod.sku).toBe("A-001");
  expect(prod.nombre).toBe("Cable HDMI");
  expect(prod.stock).toBe(0);
});

test("lanza error si falta sku o nombre", () => {
  const { crearProducto } = require("./inventoryService");
  expect(() => crearProducto({ sku: "A-002" })).toThrow(
    "SKU y nombre son obligatorios",
  );
  expect(() => crearProducto({ sku: "Mouse" })).toThrow(
    "SKU y nombre son obligatorios",
  );
});

test("obtenerVersion retorna la versión de la API", () => {
  const { obtenerVersion } = require("./inventoryService");
  const resultado = obtenerVersion();
  expect(resultado).toEqual({ version: "1.0.0" });
});

describe("validarProducto", () => {
  test("no lanza error para datos válidos", () => {
    expect(() => validarProducto({ sku: "T-123", nombre: "Teclado" })).not.toThrow();
  });

  test("lanza error si falta sku", () => {
    expect(() => validarProducto({ nombre: "Teclado" })).toThrow("SKU y nombre son obligatorios");
  });

  test("lanza error si falta nombre", () => {
    expect(() => validarProducto({ sku: "T-123" })).toThrow("SKU y nombre son obligatorios");
  });

  test("lanza error si faltan ambos campos", () => {
    expect(() => validarProducto(null)).toThrow("SKU y nombre son obligatorios");
  });
});

describe("formatearProducto", () => {
  test("retorna objeto con sku, nombre y stock", () => {
    const resultado = formatearProducto("A-001", "Cable HDMI", 10);
    expect(resultado).toEqual({ sku: "A-001", nombre: "Cable HDMI", stock: 10 });
  });

  test("stock es 0 por defecto si no se proporciona", () => {
    const resultado = formatearProducto("A-002", "Mouse");
    expect(resultado.stock).toEqual(0);
  });
});
