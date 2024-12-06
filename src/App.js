import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Ordenes from './pages/Ordenes';
import Facturas from './pages/Facturas';
import Footer from './components/Footer';
import './App.css';
import useAuthStore from './stores/authStore';

function App() {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <div className="app-container">
            <main className="main-content">
                <Routes>
                    {!isAuthenticated ? (
                        <>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <Route path="/" element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            {user?.rol === 'ADMIN' ? (
                                <>
                                    <Route path="/productos" element={<Productos />} />
                                    <Route path="/ordenes" element={<Ordenes />} />
                                    <Route path="/facturas" element={<Facturas />} />
                                </>
                            ) : user?.rol === 'TRABAJADOR' ? (
                                <>
                                    <Route path="/ordenes" element={<Ordenes />} />
                                    <Route path="/facturas" element={<Facturas />} />
                                </>
                            ) : (
                                <Route path="*" element={<Navigate to="/login" />} />
                            )}
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Route>
                    )}
                </Routes>
            </main>
            {isAuthenticated && <Footer />}
        </div>
    );
}

export default App;
