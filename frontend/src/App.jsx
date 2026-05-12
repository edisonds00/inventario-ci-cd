import { useEffect, useState } from "react";
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
const API_URL = 'http://localhost:3000/api/productos';
function App() {
  // Lista de productos ya cargados desde el backend
  const [productos, setProductos] = useState([]);
  // Campos del formulario
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  // Cargar productos al inicio
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => setProductos(json.data ?? []))
      .catch((err) => console.error('Error cargando productos', err));
  }, []);
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // evitar recarga de la página
    const nuevo = { sku, nombre };
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    if (resp.ok) {
      const json = await resp.json();
      // Añadir producto a la lista en pantalla
      setProductos((prev) => [...prev, json.data]);
      // Limpiar campos
      setSku('');
      setNombre('');
    } else {
      alert('Error al crear producto');
    }
  };
  /*function App() {
  const [count, setCount] = useState(0)*/
  return (
    <div>
      <h1>Inventario Web (Demo)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>SKU:</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="A-001"
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Cable HDMI"
          />
        </div>
        <button type="submit">Crear producto</button>
      </form>
      <hr />
      <h2>Productos actuales</h2>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.sku} - {p.nombre} (stock: {p.stock})
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;