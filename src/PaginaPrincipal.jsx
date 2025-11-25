import React from 'react'
import { Link } from 'react-router-dom';
import '../CSS/PaginaPrincipal.css';

const PaginaPrincipal = () => {
  return (
    <main className='contenedor-principal'>
        <div className='caja-fondo'>
            <div className='bienvenida'>
                <h1>Bienvenido al Sistema Bancario</h1>
                <p>Gestiona tus cuentas y transacciones de manera segura y eficiente.</p>
                <div className='datos'>
                    <Link to="/registro">Registrarse</Link>
                    <Link to="/login">Iniciar Sesión</Link>               
                </div>
            </div>
        </div>
    </main>
  )
}

export default PaginaPrincipal