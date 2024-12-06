import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import LogoAC from '../assets/imagenes/LogoAC.png';
import useAuthStore from '../stores/authStore';
import authService from '../services/authService';

const Layout = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      authService.performLogout(); 
      navigate('/login'); 
    }
  };

  if (!user) return null; 

  return (
    <div>
      <div className="menu-toggle" onClick={() => setMenuActive(!menuActive)}>
        ☰
      </div>
      <nav className={menuActive ? 'active' : ''}>
        <img src={LogoAC} alt="LogoAC" />
        <h1>La Fortuna Burguer</h1>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          {user.rol === 'ADMIN' && (
            <>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/ordenes">Ordenes</Link></li>
              <li><Link to="/facturas">Facturas</Link></li>
            </>
          )}
          {user.rol === 'TRABAJADOR' && (
            <>
              <li><Link to="/ordenes">Ordenes</Link></li>
              <li><Link to="/facturas">Facturas</Link></li>
            </>
          )}
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>
      <div className="main-content">
        <hr />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
