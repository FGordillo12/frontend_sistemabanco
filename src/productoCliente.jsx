import React, { useState, useEffect } from "react";

const ProductoCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const API_URL = "http://localhost:3000/api/productosCliente"; // ruta backend productos clientes

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const data = await respuesta.json();
      setClientes(data.clientes || []);
    } catch (error) {
      console.error("Error cargando productos clientes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteData = { nombre, descripcion };

    try {
      let respuesta, data;
      if (editId) {
        respuesta = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteData),
        });
        data = await respuesta.json();
        setMensaje(data.message || "Producto cliente actualizado");
      } else {
        respuesta = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteData),
        });
        data = await respuesta.json();
        setMensaje(data.message || "Producto cliente creado");
      }

      setNombre("");
      setDescripcion("");
      setEditId(null);
      fetchClientes();
    } catch (error) {
      console.error("Error en producto cliente:", error);
      setMensaje("Error de servidor");
    }
  };

  const handleEdit = (cliente) => {
    setNombre(cliente.nombre);
    setDescripcion(cliente.descripcion);
    setEditId(cliente._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto cliente?")) return;

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await respuesta.json();
      setMensaje(data.message || "Producto cliente eliminado");
      fetchClientes();
    } catch (error) {
      console.error("Error eliminando producto cliente:", error);
      setMensaje("Error de servidor");
    }
  };

  return (
    <div className="contenedor-productos">
      <h1>Productos Cliente</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h2>Lista de productos clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente._id}>
            <strong>{cliente.nombre}</strong>: {cliente.descripcion}
            <button onClick={() => handleEdit(cliente)}>Editar</button>
            <button onClick={() => handleDelete(cliente._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductoCliente;
