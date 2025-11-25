import React from 'react'
import '../CSS/dashboard.css'
import { useNavigate } from 'react-router-dom';


function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    onLogout();      // limpia el usuario
    navigate("/");   // redirige a la ruta que quieras
  };

  return (
    <div>
      <header>
        <nav className='encabezado'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Bienvenido {user?.correo}</h2>
            </div>
            <button className= 'cerrarsesion' onClick={cerrarSesion}>Cerrar Sesión</button>
        </nav>
      </header>
      
      <main className='caja_principal'>
        <section className='modulos'>
          <h1>FUNCIONALIDADES ADMINISTRADOR</h1>
          <div className='modulos_contenido'> 
              <div className='contenido' onClick={() => navigate('/crear_cliente')}>
                <img src = "/IMAGENES/nuevo-usuario.png"/>
                <h2>Crear Cliente</h2>
              </div>

              <div className='contenido' onClick={ () => navigate ('/productos_cliente')}>
                <img src = "/IMAGENES/dinero.png"/>
                <h2>Productos bancarios</h2>
              </div>
          </div>
          
        </section>
        
      </main>
    </div>
  )
}

export default Dashboard