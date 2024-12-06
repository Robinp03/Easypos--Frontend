import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LogoAC from '../assets/imagenes/LogoAC.png';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [rol, setRol] = useState('TRABAJADOR'); // Por defecto, rol de trabajador
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Mensaje de éxito
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
     
      const response = await register({ nombre, email, contrasena, rol });
      console.log("exito al registrar", response)

      
      setSuccessMessage('Usuario registrado con éxito. Ahora puedes iniciar sesión.');

      
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (error) {
      setError('Error al registrarse. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="register-container">
      <img src={LogoAC} alt="LogoAC" />
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          
          <option value="TRABAJADOR">Trabajador</option>
        </select>
        <button type="submit">Registrarse</button>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>} 
      </form>
    </div>
  );
};

export default Register;

