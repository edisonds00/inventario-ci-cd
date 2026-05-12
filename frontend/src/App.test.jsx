import { render, screen } from '@testing-library/react'
import App from './App'
describe('App', () => {
    it('muestra el título de la aplicación', () => {
        render(<App />);
        const titulo = screen.getByText(/Inventario Web \(Demo\)/i);
        expect(titulo).toBeDefined();
    });
});