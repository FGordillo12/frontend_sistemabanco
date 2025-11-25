import React, { useState, useEffect } from "react";
import Login from "./Login.jsx";
import Dashboard from "./dashboard.jsx";
import Registro from "./Registro.jsx";
import PaginaPrincipal from "./PaginaPrincipal.jsx";
import Cuenta from "./cuenta.jsx";
import ProductoBancario from "./productoBancario.jsx"; // <-- reemplazado
import DashboardCliente from "./dashboardCliente.jsx";
import EstadoCuenta from "./estadoCuenta.jsx";
import Consignaciones from "./consignaciones.jsx";
import Retiros from "./retiros.jsx";
import RecargarSaldo from "./recargarSaldo.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [saldoGlobal, setSaldoGlobal] = useState(0);
  const [cargandoSaldo, setCargandoSaldo] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setUser(usuario);

      if (usuario._id) {
        obtenerSaldoActual(usuario._id);
      }
    }
  }, []);

  const obtenerSaldoActual = async (userId) => {
    try {
      setCargandoSaldo(true);
      const response = await axios.get(
        `http://localhost:3000/api/transacciones/saldo/${userId}`
      );
      setSaldoGlobal(response.data.saldo);
    } catch (error) {
      console.error("Error obteniendo saldo:", error);
    } finally {
      setCargandoSaldo(false);
    }
  };

  const actualizarSaldoGlobal = (nuevoSaldo) => {
    setSaldoGlobal(nuevoSaldo);
  };

  const handleLogin = (usuario) => {
    setUser(usuario);
    localStorage.setItem("user", JSON.stringify(usuario));
    if (usuario._id) {
      obtenerSaldoActual(usuario._id);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSaldoGlobal(0);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Dashboard Admin */}
        <Route
          path="/dashboard"
          element={
            user && user.correo ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />

        {/* Dashboard Cliente */}
        <Route
          path="/dashboardCliente"
          element={
            user && user.correo ? (
              <DashboardCliente
                user={user}
                onLogout={handleLogout}
                saldoGlobal={saldoGlobal}
                cargandoSaldo={cargandoSaldo}
              />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />

        {/* Registro y creación de cliente */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/crear_cliente" element={<Cuenta />} />

        {/* Productos Bancarios (solo usuarios autenticados) */}
        <Route
          path="/productos_cliente"
          element={
            user && user.correo ? (
              <ProductoBancario user={user} />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />

        {/* Estado de cuenta */}
        <Route
          path="/verificarSaldo"
          element={
            user ? (
              <EstadoCuenta user={user} saldoGlobal={saldoGlobal} />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />

        {/* Consignaciones */}
        <Route
          path="/consignaciones"
          element={
            user ? (
              <Consignaciones
                user={user}
                saldoGlobal={saldoGlobal}
                actualizarSaldo={actualizarSaldoGlobal}
                cargandoSaldo={cargandoSaldo}
              />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />

        {/* Retiros */}
        <Route
          path="/retiros"
          element={
            user ? (
              <Retiros
                user={user}
                saldoGlobal={saldoGlobal}
                actualizarSaldo={actualizarSaldoGlobal}
                cargandoSaldo={cargandoSaldo}
              />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />

        {/* Recargar saldo */}
        <Route
          path="/recargarSaldo"
          element={
            user ? (
              <RecargarSaldo
                user={user}
                saldoGlobal={saldoGlobal}
                actualizarSaldo={actualizarSaldoGlobal}
                cargandoSaldo={cargandoSaldo}
              />
            ) : (
              <h2>No estás autenticado</h2>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
