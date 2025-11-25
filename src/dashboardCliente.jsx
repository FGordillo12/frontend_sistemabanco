import React, { useState } from 'react'
import '../CSS/dashboard.css'
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const cerrarSesion = () => {
    onLogout();      // limpia el usuario
    navigate("/");   // redirige a la ruta que quieras
  };

  const handleLogoutClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirmDialog(false);
    cerrarSesion();
  };

  const handleCancelLogout = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div>
      {/* Ventana de diálogo de confirmación */}
      {showConfirmDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Confirmar Cierre de Sesion</h3>
            <p>¿Estas seguro de que deseas cerrar sesion?</p>
            <div className="dialog-buttons">
              <button className="btn-cancel" onClick={handleCancelLogout}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleConfirmLogout}>
                Sí, Cerrar Sesion
              </button>
            </div>
          </div>
        </div>
      )}
      
      <header>
        <nav className='encabezado'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Bienvenido {user?.correo}</h2>
            </div>
            <button className='cerrarsesion' onClick={handleLogoutClick}>Cerrar Sesión</button>
        </nav>
      </header>
      
      <main className='caja_principal'>
        <section className='modulos'>
          <h1>FUNCIONALIDADES CLIENTE</h1>
          <div className='modulos_contenido'> 
              <div className='contenido' onClick={() => navigate('/consignaciones')}>
                <img src="/IMAGENES/consignaciones.png"/>
                <h2>Consignaciones</h2>
              </div>

              <div className='contenido' onClick={() => navigate('/retiros')}>
                <img src="/IMAGENES/retiros.png"/>
                <h2>Retiros</h2>
              </div>

              <div className='contenido' onClick={() => navigate('/verificarSaldo')}>
                <img src="/IMAGENES/aprobar-banca.png"/>
                <h2>Estado Cuenta</h2>
              </div>

              <div className='contenido' onClick={() => navigate('/recargarSaldo')}>
                <img src="/IMAGENES/recargar-saldo.png"/>
                <h2>Recargar Saldo</h2>
              </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard