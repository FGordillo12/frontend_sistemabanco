import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../CSS/Modulo_RecargarSaldo.css"

function RecargarSaldo({ user, saldoGlobal, actualizarSaldo, cargandoSaldo }) {
  const navigate = useNavigate()
  const [datosRecarga, setDatosRecarga] = useState({
    monto: '',
    metodoPago: 'transferencia',
    concepto: ''
  })
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setDatosRecarga({
      ...datosRecarga,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!datosRecarga.monto) {
      alert('❌ Error: Ingrese un monto');
      return;
    }

    const montoNumerico = parseFloat(datosRecarga.monto);
    if (isNaN(montoNumerico) || montoNumerico < 10000) {
      alert('❌ Error: Monto minimo $10,000');
      return;
    }

    setCargando(true)
    
    try {
      const requestData = {
        userId: user._id.toString(),
        monto: montoNumerico,
        metodoPago: datosRecarga.metodoPago,
        concepto: datosRecarga.concepto || 'Recarga de saldo'
      };

      const response = await axios.post(
        'http://localhost:3000/api/transacciones/recargar-saldo', 
        requestData
      );

      if (response.data.success) {
        // ✅ Actualizar el saldo global en App.jsx
        actualizarSaldo(response.data.nuevoSaldo);
        alert(`✅ Recarga exitosa! Nuevo saldo: $${response.data.nuevoSaldo.toLocaleString()}`)
        setDatosRecarga({ monto: '', metodoPago: 'transferencia', concepto: '' })
      }
    } catch (error) {
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
    <div className="recargar-saldo-container">
      <header className="recargar-saldo-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="recargar-saldo-title">Recargar Saldo</h1>
        
        {/* Saldo actual desde props globales */}
        <div className="saldo-actual">
          <span className="saldo-label">Saldo actual:</span>
          <span className="saldo-monto">
            {cargandoSaldo ? 'Cargando...' : formatCurrency(saldoGlobal)}
          </span>
        </div>
      </header>
      
      <div className="recargar-saldo-form-container">
        <form onSubmit={handleSubmit} className="recargar-saldo-form">
          <div className="form-group">
            <label className="form-label">
              Monto a Recargar:
            </label>
            <input
              type="number"
              name="monto"
              value={datosRecarga.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto a recargar"
              required
              min="10000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Metodo de Pago:
            </label>
            <select
              name="metodoPago"
              value={datosRecarga.metodoPago}
              onChange={handleChange}
              className="form-select"
            >
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="tarjeta">Tarjeta Debito/Credito</option>
              <option value="efectivo">Pago en Efectivo</option>
              <option value="billetera">Nequi</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Concepto:
            </label>
            <textarea
              name="concepto"
              value={datosRecarga.concepto}
              onChange={handleChange}
              placeholder="Descripcion de la recarga (opcional)"
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
              className="recargar-button"
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : 'Realizar Recarga'}
            </button>
          </div>
        </form>
      </div>

      <div className="recargar-saldo-info">
        <h3 className="info-title">Información Importante:</h3>
        <ul className="info-list">
          <li>Las recargas se procesan en un máximo de 24 horas</li>
          <li>El saldo se añadira automáticamente a tu cuenta</li>
          <li>Monto minimo de recarga: $10.000</li>
          <li>Monto maximo por recarga: $5'000.000</li>
          <li>Comisiones pueden aplicar según el metodo de pago</li>
        </ul>
      </div>
    </div>
  )
}

export default RecargarSaldo