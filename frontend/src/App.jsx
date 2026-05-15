import { useEffect, useState } from "react";
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { set } from "../../backend/src/app";
const API_URL = 'http://localhost:3000/api/products';
function App() {
  // Lista de productos ya cargados desde el backend
  const [productos, setProductos] = useState([]);
  // Campos del formulario
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [editandoSku, setEditandoSku] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  // Cargar productos al inicio
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => setProductos(json.data ?? []))
      .catch((err) => console.error('Error cargando productos', err));
  }, []);
  
  // Manejar envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');

    if (editandoSku) {
      // Modo edición: PUT
      try {
        const resp = await fetch(`${API_URL}/${editandoSku}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre })
        });
        if (resp.ok) {
          const json = await resp.json();
          setProductos(prev =>
            prev.map(p => p.sku === editandoSku ? json.data : p)
          );
          // Limpiar formulario
          setSku('');
          setNombre('');
          setEditandoSku(null);
        } else {
          const errorData = await resp.json();
          setMensajeError(errorData.message || 'Error al actualizar');
        }
      } catch (err) {
        setMensajeError('Error de conexión');
      }
    } else {
      // Modo creación: POST
      const nuevo = { sku, nombre };
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      if (resp.ok) {
        const json = await resp.json();
        setProductos(prev => [...prev, json.data]);
        setSku('');
        setNombre('');
      } else {
        const errorData = await resp.json();
        setMensajeError(errorData.message || 'Error al crear');
      }
    }
  };

  // Preparar edición
  const handleEdit = (producto) => {
    setSku(producto.sku);
    setNombre(producto.nombre);
    setEditandoSku(producto.sku);
    setMensajeError('');
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setSku('');
    setNombre('');
    setEditandoSku(null);
    setMensajeError('');
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
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU"
            disabled={!!editandoSku} // No se puede cambiar el SKU al editar
            required
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            type="text"
            required
          />
        </div>
        <button type="submit">{editandoSku ? 'Actualizar producto' : 'Crear producto'}</button>
        {editandoSku && <button type="button" onClick={handleCancelEdit}>Cancelar</button>}
      </form>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
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