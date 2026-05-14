const productos = [];
let ultimoId = 0;

//Funcion de validacion
function validarProducto(data) {
  if (!data || !data.sku || !data.nombre) {
    throw new Error("SKU y nombre son obligatorios");
  }
}

//Funcion de formateo
function formatearProducto(sku,nombre,stock=0) {
  return { sku, nombre, stock };
}

//Funcion para crear un nuevo producto refactorizada
function crearProducto(data) {
  validarProducto(data);
  const nuevo = formatearProducto(data.sku, data.nombre, data.stock);
  productos.push(nuevo);
  return nuevo;
}

function listarProductos() {
  return [...productos];
}

function obtenerVersion() {
  return { version: "1.0.0",};
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerVersion,
  validarProducto,
  formatearProducto,
};
