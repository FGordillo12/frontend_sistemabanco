import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../CSS/Modulo_EstadoCuenta.css"

function EstadoCuenta({ user, saldoGlobal }) {
  const navigate = useNavigate()
  const [cuenta, setCuenta] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Obtener transacciones reales del usuario
  useEffect(() => {
    const obtenerTransacciones = async () => {
      try {
        setCargando(true)
        setError(null)
        
        // OBTENER EL NÚMERO DE CUENTA REAL DEL USUARIO PRIMERO
        const usuarioResponse = await axios.get(`http://localhost:3000/api/transacciones/saldo/${user._id}`)
        console.log('📊 Datos del usuario:', usuarioResponse.data)
        
        // Obtener transacciones
        const transaccionesResponse = await axios.get(`http://localhost:3000/api/transacciones/transacciones/${user._id}`)
        
        // Ordenar transacciones por fecha (más recientes primero)
        const transaccionesOrdenadas = transaccionesResponse.data.transacciones.sort((a, b) => 
          new Date(b.fecha) - new Date(a.fecha)
        )
        
        setMovimientos(transaccionesOrdenadas)
        
        // Configurar cuenta con datos reales
        setCuenta({
          numero: usuarioResponse.data.numeroCuenta || 'No asignado',
          saldo: saldoGlobal,
          moneda: 'COP',
          fechaApertura: '2024-01-01',
          correo: usuarioResponse.data.correo
        })
        
      } catch (error) {
        console.error('Error obteniendo datos:', error)
        setError('Error al cargar los datos de la cuenta')
        
        // En caso de error, mostrar datos básicos
        setMovimientos([])
        setCuenta({
          numero: 'No disponible',
          saldo: saldoGlobal,
          moneda: 'COP',
          fechaApertura: '2024-01-01',
          correo: user.correo
        })
      } finally {
        setCargando(false)
      }
    }

    if (user?._id) {
      obtenerTransacciones()
    }
  }, [user?._id, saldoGlobal, user?.correo])

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  const handleFiltrar = async (e) => {
    e.preventDefault()
    
    try {
      setCargando(true)
      let url = `http://localhost:3000/api/transacciones/transacciones/${user._id}`
      
      // Agregar filtros de fecha si están presentes
      if (fechaInicio || fechaFin) {
        const params = new URLSearchParams()
        if (fechaInicio) params.append('fechaInicio', fechaInicio)
        if (fechaFin) params.append('fechaFin', fechaFin)
        url += `?${params.toString()}`
      }
      
      const response = await axios.get(url)
      const transaccionesOrdenadas = response.data.transacciones.sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      )
      setMovimientos(transaccionesOrdenadas)
      
    } catch (error) {
      console.error('Error filtrando transacciones:', error)
      alert('Error al aplicar filtros')
    } finally {
      setCargando(false)
    }
  }

  const limpiarFiltros = async () => {
    setFechaInicio('')
    setFechaFin('')
    
    try {
      setCargando(true)
      const response = await axios.get(`http://localhost:3000/api/transacciones/transacciones/${user._id}`)
      const transaccionesOrdenadas = response.data.transacciones.sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      )
      setMovimientos(transaccionesOrdenadas)
    } catch (error) {
      console.error('Error obteniendo transacciones:', error)
    } finally {
      setCargando(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO')
  }

  // Calcular resumen basado en transacciones reales
  const calcularResumen = () => {
    const ingresos = movimientos
      .filter(t => t.tipo.includes('recarga') || t.tipo.includes('recibo'))
      .reduce((sum, t) => sum + (t.monto > 0 ? t.monto : 0), 0)
    
    const egresos = movimientos
      .filter(t => t.tipo.includes('retiro') || t.tipo.includes('envio'))
      .reduce((sum, t) => sum + (t.monto < 0 ? Math.abs(t.monto) : t.monto), 0)

    return {
      ingresos,
      egresos,
      saldoFinal: saldoGlobal
    }
  }

  const resumen = calcularResumen()

  // Función para formatear la descripción según el tipo de transacción
  const getDescripcion = (transaccion) => {
    switch (transaccion.tipo) {
      case 'recarga':
        return `Recarga - ${transaccion.metodoPago || ''}`
      case 'retiro':
        return `Retiro - ${transaccion.concepto || ''}`
      case 'consignacion_envio':
        return `Consignación a ${transaccion.cuentaDestino || ''}`
      case 'consignacion_recibo':
        return `Consignación de ${transaccion.cuentaOrigen || ''}`
      default:
        return transaccion.concepto || 'Transacción'
    }
  }

  return (
    <div className="estado-cuenta-container">
      <header className="estado-cuenta-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="estado-cuenta-title">Estado de Cuenta</h1>
      </header>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Información de la Cuenta */}
      {cuenta && (
        <div className="info-cuenta">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Numero de Cuenta:</span>
              <span className="info-value" style={{ 
                fontWeight: 'bold', 
                color: cuenta.numero === 'No asignado' ? '#dc3545' : '#28a745' 
              }}>
                {cuenta.numero}
                {cuenta.numero === 'No asignado' && (
                  <small style={{ display: 'block', color: '#6c757d', fontSize: '0.8em' }}>
                    (Contacta al administrador para asignar un numero de cuenta)
                  </small>
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Saldo Disponible:</span>
              <span className="info-saldo">{formatCurrency(cuenta.saldo)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Moneda:</span>
              <span className="info-value">{cuenta.moneda}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Titular:</span>
              <span className="info-value">{cuenta.correo}</span>
            </div>
          </div>
        </div>
      )}

      {/* Resto del código se mantiene igual */}
      <div className="filtros-container">
        <h3 className="filtros-title">Filtrar por Fecha</h3>
        <form onSubmit={handleFiltrar} className="filtros-form">
          <div className="filtro-group">
            <label className="filtro-label">Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="filtro-input"
            />
          </div>
          <div className="filtro-group">
            <label className="filtro-label">Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="filtro-input"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="filtro-button">
              Aplicar Filtro
            </button>
            <button 
              type="button" 
              className="filtro-button"
              onClick={limpiarFiltros}
              style={{ backgroundColor: '#6c757d' }}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Movimientos */}
      <div className="movimientos-container">
        <h3 className="movimientos-title">
          {cargando ? 'Cargando movimientos...' : 'Ultimos Movimientos'}
        </h3>
        <div className="movimientos-table-container">
          {movimientos.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6c757d',
              backgroundColor: 'white'
            }}>
              {cargando ? 'Cargando...' : 'No hay movimientos para mostrar'}
            </div>
          ) : (
            <table className="movimientos-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripcion</th>
                  <th>Monto</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento, index) => (
                  <tr key={movimiento._id || index} className={
                    movimiento.tipo.includes('recarga') || movimiento.tipo.includes('recibo') ? 'ingreso' : 'egreso'
                  }>
                    <td>{formatDate(movimiento.fecha)}</td>
                    <td>{getDescripcion(movimiento)}</td>
                    <td className={`monto ${
                      movimiento.tipo.includes('recarga') || movimiento.tipo.includes('recibo') ? 'ingreso' : 'egreso'
                    }`}>
                      {movimiento.monto > 0 ? '+' : ''}{formatCurrency(movimiento.monto)}
                    </td>
                    <td className="saldo">
                      {formatCurrency(saldoGlobal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Resumen */}
      {!cargando && movimientos.length > 0 && (
        <div className="resumen-container">
          <h3 className="resumen-title">Resumen del Periodo</h3>
          <div className="resumen-grid">
            <div className="resumen-item ingresos">
              <span className="resumen-label">Total Ingresos:</span>
              <span className="resumen-monto positivo">
                {formatCurrency(resumen.ingresos)}
              </span>
            </div>
            <div className="resumen-item egresos">
              <span className="resumen-label">Total Egresos:</span>
              <span className="resumen-monto negativo">
                {formatCurrency(resumen.egresos)}
              </span>
            </div>
            <div className="resumen-item saldo-final">
              <span className="resumen-label">Saldo Final :</span>
              <span className="resumen-monto final">
                {formatCurrency(resumen.saldoFinal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstadoCuenta