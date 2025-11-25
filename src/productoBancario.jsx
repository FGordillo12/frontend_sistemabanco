import React, { useState } from "react";
import axios from "axios";
import "../CSS/productoBancario.css";

const ProductoBancario = () => {
  const [correoCliente, setCorreoCliente] = useState("");
  const [tipoProducto, setTipoProducto] = useState("Ahorros");
  const [productosCliente, setProductosCliente] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // URL correcta del backend
  const API_URL = "http://localhost:3000/api/productos-bancarios";

  // Buscar productos de un cliente
  const handleBuscar = async () => {
    if (!correoCliente) {
      alert("Ingresa el correo del cliente");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/cliente/${correoCliente}`);
      setProductosCliente(res.data);
      setMensaje(
        res.data.length === 0
          ? "No se encontraron productos para este cliente"
          : ""
      );
    } catch (error) {
      console.error("Error buscando productos:", error);
      setProductosCliente([]);
      setMensaje(error.response?.data?.message || "Error al buscar productos");
    }
  };

  // Crear producto para el cliente
  const handleCrear = async (e) => {
    e.preventDefault();
    if (!correoCliente) {
      alert("Ingresa el correo del cliente");
      return;
    }
    try {
      const res = await axios.post(API_URL, {
        correo: correoCliente,
        tipo: tipoProducto,
      });
      alert(`Producto creado: ${res.data.numeroCuenta} (${res.data.tipo})`);
      setTipoProducto("Ahorros");
      // Refrescar lista
      handleBuscar();
    } catch (error) {
      console.error("Error creando producto:", error);
      alert(error.response?.data?.message || "Error al crear producto");
    }
  };

  // Eliminar producto
  const handleEliminar = async (productoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await axios.delete(`${API_URL}/${productoId}`);
      alert("Producto eliminado correctamente");
      handleBuscar(); // refrescar lista
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert(error.response?.data?.message || "Error al eliminar producto");
    }
  };

  return (
    <main className="contenedor-principal">
      <div className="caja-fondo">
        <h1>Asignar Producto Bancario a Cliente</h1>

        <div className="formulario">
          <label>Correo Cliente:</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={correoCliente}
            onChange={(e) => setCorreoCliente(e.target.value)}
            required
          />

          <button type="button" onClick={handleBuscar}>
            Buscar Productos
          </button>

          <form onSubmit={handleCrear}>
            <label>Tipo de Producto:</label>
            <select
              value={tipoProducto}
              onChange={(e) => setTipoProducto(e.target.value)}
            >
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
              <option value="CDT">CDT</option>
            </select>

            <button type="submit">Crear Producto</button>
          </form>

          {mensaje && <p>{mensaje}</p>}

          {productosCliente.length > 0 && (
            <>
              <h2>Productos del Cliente</h2>
              <ul>
                {productosCliente.map((p) => (
                  <li key={p._id}>
                    {p.tipo} - Nº Cuenta: {p.numeroCuenta} - Saldo: $
                    {p.saldo.toFixed(2)}
                    <button onClick={() => handleEliminar(p._id)}>
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductoBancario;
