import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { vi } from 'vitest';

// Mock de fetch global
beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(async (url, options) => {
    // Normalizar la URL para extraer solo la ruta
    const urlObj = new URL(url, 'http://localhost:3000');
    const path = urlObj.pathname; // /api/products o /api/products/ALGUN-SKU

    // GET a /api/products -> listar
    if (path === '/api/products' && (!options || options.method === 'GET')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: [{ sku: 'T-001', nombre: 'Teclado', stock: 5 }] })
      };
    }

    // POST a /api/products -> crear
    if (path === '/api/products' && options?.method === 'POST') {
      const body = JSON.parse(options.body);
      if (!body.sku || !body.nombre) {
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: 'VALIDATION_ERROR', message: 'SKU y nombre son obligatorios' })
        };
      }
      return {
        ok: true,
        status: 201,
        json: async () => ({ data: { sku: body.sku, nombre: body.nombre, stock: 0 } })
      };
    }

    // PUT a /api/products/:sku -> actualizar
    const matchPut = path.match(/^\/api\/products\/(.+)$/);
    if (matchPut && options?.method === 'PUT') {
      const sku = matchPut[1];
      const body = JSON.parse(options.body);
      if (!body.nombre) {
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: 'VALIDATION_ERROR', message: 'SKU y nombre son obligatorios' })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: { sku, nombre: body.nombre, stock: 5 } })
      };
    }

    // Cualquier otra petición
    return Promise.reject(new Error(`Petición no mockeada: ${options?.method} ${url}`));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renderiza el formulario y la lista inicial', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/Teclado/)).toBeInTheDocument();
  });
});

test('permite editar un producto y muestra el botón Guardar cambios', async () => {
  render(<App />);
  const user = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByText(/Teclado/)).toBeInTheDocument();
  });

  // Hacer clic en Editar
  await user.click(screen.getByText('Editar'));

  // El SKU debe estar deshabilitado y el botón cambiar a "Guardar cambios"
  expect(screen.getByPlaceholderText('SKU')).toBeDisabled();
  expect(screen.getByText('Guardar cambios')).toBeInTheDocument();
  expect(screen.getByText('Cancelar')).toBeInTheDocument();

  // Cambiar el nombre y guardar
  await user.clear(screen.getByPlaceholderText('Nombre'));
  await user.type(screen.getByPlaceholderText('Nombre'), 'Teclado Mecánico');
  await user.click(screen.getByText('Guardar cambios'));

  // Verificar que se actualizó en la lista (mock devuelve nombre actualizado)
  await waitFor(() => {
    expect(screen.getByText(/Teclado Mecánico/)).toBeInTheDocument();
  });
});

test('muestra mensaje de error si intenta guardar edición sin nombre', async () => {
  render(<App />);
  const user = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByText(/Teclado/)).toBeInTheDocument();
  });

  await user.click(screen.getByText('Editar'));

  // Limpiar el campo nombre y guardar
  await user.clear(screen.getByPlaceholderText('Nombre'));
  await user.click(screen.getByText('Guardar cambios'));

  // Esperar el mensaje de error
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/SKU y nombre son obligatorios/);
  });
});