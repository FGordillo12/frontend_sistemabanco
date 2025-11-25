import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../CSS/Modulo_Consignaciones.css";

function Consignaciones({ user, saldoGlobal, actualizarSaldo, cargandoSaldo }) {
  const navigate = useNavigate()
  const [datosConsignacion, setDatosConsignacion] = useState({
    numeroCuenta: '',
    monto: '',
    concepto: ''
  })
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setDatosConsignacion({
      ...datosConsignacion,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!datosConsignacion.numeroCuenta) {
      alert('❌ Error: Ingrese el número de cuenta destino');
      return;
    }

    if (!datosConsignacion.monto) {
      alert('❌ Error: Ingrese un monto');
      return;
    }

    const montoNumerico = parseFloat(datosConsignacion.monto);
    if (isNaN(montoNumerico) || montoNumerico < 1000) {
      alert('❌ Error: Monto mínimo $1,000');
      return;
    }

    setCargando(true)
    
    try {
      // Limpiar y normalizar el número de cuenta
      const cuentaDestinoLimpia = datosConsignacion.numeroCuenta.trim().toUpperCase();
      
      const requestData = {
        userId: user._id.toString(),
        cuentaDestino: cuentaDestinoLimpia, // ← Enviar limpio y en mayúsculas
        monto: montoNumerico,
        concepto: datosConsignacion.concepto || 'Consignación'
      };

      console.log('📤 Enviando datos al backend:', requestData);

      const response = await axios.post(
        'http://localhost:3000/api/transacciones/consignar', 
        requestData
      );

      if (response.data.success) {
        // ✅ Actualizar el saldo global en App.jsx
        actualizarSaldo(response.data.nuevoSaldo);
        alert(`✅ Consignación exitosa a la cuenta ${cuentaDestinoLimpia}! Nuevo saldo: $${response.data.nuevoSaldo.toLocaleString()}`)
        setDatosConsignacion({ numeroCuenta: '', monto: '', concepto: '' })
      }
    } catch (error) {
      console.error('❌ Error en consignación:', error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setCargando(false)
    }
  }

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  return (
    <div className="consignaciones-container">
      <header className="consignaciones-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="consignaciones-title">Consignaciones</h1>
        
        {/* Saldo actual desde props globales */}
        <div className="saldo-actual">
          <span className="saldo-label">Saldo actual:</span>
          <span className="saldo-monto">
            {cargandoSaldo ? 'Cargando...' : formatCurrency(saldoGlobal)}
          </span>
        </div>
      </header>
      
      <div className="consignaciones-form-container">
        <form onSubmit={handleSubmit} className="consignaciones-form">
          <div className="form-group">
            <label className="form-label">
              Numero de Cuenta Destino:
            </label>
            <input
              type="text"
              name="numeroCuenta"
              value={datosConsignacion.numeroCuenta}
              onChange={handleChange}
              placeholder="Ingrese el numero de cuenta destino"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Monto a Consignar:
            </label>
            <input
              type="number"
              name="monto"
              value={datosConsignacion.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto"
              required
              min="1000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Concepto:
            </label>
            <textarea
              name="concepto"
              value={datosConsignacion.concepto}
              onChange={handleChange}
              placeholder="Descripcion de la consignacion"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancelar-button"
              onClick={volverAlDashboard}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="consignaciones-button"
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : 'Realizar Consignacion'}
            </button>
          </div>
        </form>
      </div>

      <div className="consignaciones-info">
        <h3 className="info-title">Informacion Importante:</h3>
        <ul className="info-list">
          <li>Las consignaciones se procesan inmediatamente</li>
          <li>Verifique bien el numero de cuenta destino</li>
          <li>Monto minimo de consignacion: $1.000</li>
          <li>Monto maximo por transaccion: $10'000.000</li>
          <li>No se permiten consignaciones a la propia cuenta</li>
        </ul>
      </div>
    </div>
  )
}

export default Consignaciones