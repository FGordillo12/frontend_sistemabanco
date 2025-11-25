import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../CSS/Modulo_Retiros.css"

function Retiros({ user, saldoGlobal, actualizarSaldo, cargandoSaldo }) {
  const navigate = useNavigate()
  const [datosRetiro, setDatosRetiro] = useState({
    monto: '',
    concepto: ''
  })
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setDatosRetiro({
      ...datosRetiro,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!datosRetiro.monto) {
      alert('❌ Error: Ingrese un monto');
      return;
    }

    const montoNumerico = parseFloat(datosRetiro.monto);
    if (isNaN(montoNumerico) || montoNumerico < 10000) {
      alert('❌ Error: Monto mínimo $10,000');
      return;
    }

    setCargando(true)
    
    try {
      const requestData = {
        userId: user._id.toString(),
        monto: montoNumerico,
        concepto: datosRetiro.concepto || 'Retiro de saldo'
      };

      const response = await axios.post(
        'http://localhost:3000/api/transacciones/retirar-saldo', 
        requestData
      );

      if (response.data.success) {
        // ✅ Actualizar el saldo global en App.jsx
        actualizarSaldo(response.data.nuevoSaldo);
        alert(`✅ Retiro exitoso! Nuevo saldo: $${response.data.nuevoSaldo.toLocaleString()}`)
        setDatosRetiro({ monto: '', concepto: '' })
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
    <div className="retiros-container">
      <header className="retiros-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="retiros-title">Retiros</h1>
        
        {/* Saldo actual desde props globales */}
        <div className="saldo-actual">
          <span className="saldo-label">Saldo actual:</span>
          <span className="saldo-monto">
            {cargandoSaldo ? 'Cargando...' : formatCurrency(saldoGlobal)}
          </span>
        </div>
      </header>
      
      <div className="retiros-form-container">
        <form onSubmit={handleSubmit} className="retiros-form">
          <div className="form-group">
            <label className="form-label">
              Monto a Retirar:
            </label>
            <input
              type="number"
              name="monto"
              value={datosRetiro.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto a retirar"
              required
              min="10000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Concepto:
            </label>
            <textarea
              name="concepto"
              value={datosRetiro.concepto}
              onChange={handleChange}
              placeholder="Descripción del retiro (opcional)"
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
              className="retiros-button"
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : 'Realizar Retiro'}
            </button>
          </div>
        </form>
      </div>

      <div className="retiros-info">
        <h3 className="info-title">Informacion Importante:</h3>
        <ul className="info-list">
          <li>Los retiros se procesan inmediatamente</li>
          <li>Verifique que tenga saldo suficiente en su cuenta</li>
          <li>Monto minimo de retiro: $10.000</li>
          <li>Monto maximo por transaccion: $2'000.000</li>
          <li>Horario de procesamiento: 24/7</li>
        </ul>
      </div>

      <div className="retiros-limites">
        <h3 className="limites-title">Limites Diarios de Retiro:</h3>
        <div className="limites-grid">
          <div className="limite-item">
            <span className="limite-tipo">Maximo por dia</span>
            <span className="limite-monto">$5'000.000</span>
          </div>
          <div className="limite-item">
            <span className="limite-tipo">Transacciones maximas</span>
            <span className="limite-monto">3 por dia</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Retiros