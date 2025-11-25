import React from 'react'
import '../CSS/Registro.css';
import { useNavigate } from "react-router-dom";

const Registro = () => {
    const [nombre, setNombre] = React.useState("");
    const [correo, setCorreo] = React.useState("");
    const [contraseña, setContraseña] = React.useState("");
    const [mensaje, setMensaje] = React.useState("");

    const navigate = useNavigate();  // redirigir después del login exitoso

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datos = { nombre, correo, contraseña };

        const respuesta = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
        });

        const data = await respuesta.json();
        setMensaje(data.mensaje || data.error);  
        setTimeout(() => setMensaje(""), 3000);

        if (respuesta.ok) {
          // Redirigir al dashboard u otra página después del login exitoso
          navigate("/login");
        }
    };
  return (
    <main className='contenedor-principal'>
        <div className='caja-fondo'>
            <h1>Registro</h1>
            <div className='formulario'>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder='Nombre Completo' required value={nombre} onChange={ (e) => setNombre(e.target.value)} />
                    <input type='email' placeholder='Correo Electrónico' required value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    <input type='password' placeholder='Contraseña' required value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                    <button type='submit'>Registrarse</button>
                </form>
                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    </main>
  )
}

export default Registro