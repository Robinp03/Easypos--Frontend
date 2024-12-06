import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoAC from '../assets/imagenes/LogoAC.png';
import useAuthStore from '../stores/authStore'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const { user, token } = await login({ email, contrasena });

      
      localStorage.setItem('authToken', token);

      
      if (user.rol === 'ADMIN') {
        navigate('/dashboard'); 
      } else if (user.rol === 'TRABAJADOR') {
        navigate('/dashboard'); 
      }
    } catch (error) {
      
      setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <img src={LogoAC} alt="LogoAC" />
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Iniciar Sesión</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p>¿No tienes una cuenta? 
  <button onClick={() => navigate('/register')} className="register-button">
    Regístrate
  </button>
</p>

    </div>
  );
};

export default Login;

