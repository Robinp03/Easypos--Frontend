import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  ArcElement, 
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement, 
  Title
} from 'chart.js';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { getOrdenes } from '../services/ordenesService';
import { getFacturas } from '../services/facturaService'; 

ChartJS.register(
  ArcElement, 
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement, 
  Title
);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [facturas, setFacturas] = useState([]); // Estado para las facturas
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;  
  
    const fetchData = async () => {
      try {
        const ordenesResponse = await getOrdenes();
        setOrders(ordenesResponse);

        const facturasResponse = await getFacturas(); // Obtener las facturas
        setFacturas(facturasResponse);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
  
    fetchData();
  }, [user]); 


  const categoryData = orders.reduce((acc, order) => {
    order.DetalleOrden.forEach((detalle) => {
      const categoryName = detalle.Producto.Categoria.nombre;
      const quantity = detalle.cantidad;

      if (acc[categoryName]) {
        acc[categoryName] += quantity;
      } else {
        acc[categoryName] = quantity;
      }
    });
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} productos`,
        },
      },
    },
  };


  const facturasPorMes = facturas.reduce((acc, factura) => {
    const mes = new Date(factura.fecha).toLocaleString('default', { month: 'long' });
    if (acc[mes]) {
      acc[mes] += 1;
    } else {
      acc[mes] = 1;
    }
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(facturasPorMes),
    datasets: [
      {
        label: 'Cantidad de ventas',
        data: Object.values(facturasPorMes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mes',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de ventas',
        },
        beginAtZero: true,
      },
    },
  };




  return (
    <div className="dashboard">
      <h1>Bienvenido, {user.nombre}</h1>
      <h2>Panel de Control</h2>

      {user.rol === 'ADMIN' && (
        <div className="admin-dashboard">
          <p>Como Administrador, puedes gestionar productos, ordenes y más.</p>
          <button onClick={() => navigate('/Productos')}>Ver Productos</button>
          <button onClick={() => navigate('/Ordenes')}>Ver Ordenes</button>
          <button onClick={() => navigate('/Facturas')}>Ver Facturas</button>
        </div>
      )}

      {user.rol === 'TRABAJADOR' && (
        <div className="worker-dashboard">
          <p>Como Trabajador, solo puedes gestionar las órdenes y las facturas.</p>
          <button onClick={() => navigate('/Ordenes')}>Ver Ordenes</button>
          <button onClick={() => navigate('/Facturas')}>Ver Facturas</button>
        </div>
      )}

      
      <div className="chart-container">
      <div className='classPie'><h3>Cantidad de productos vendidos</h3>
        <Pie data={pieChartData} options={pieChartOptions} />
       </div>
        <h3>Ventas realizadas</h3>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
      

    </div >
  );
};

export default Dashboard;

