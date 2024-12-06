import React, { useState, useEffect } from 'react';
import { getOrdenes, createOrden, createDetalleOrden, getDetallesOrden } from '../services/ordenesService.js';
import { getProductos } from '../services/productoService.js';
import { getCategorias } from '../services/categoriaService.js';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [message, setMessage] = useState('');
    const [product, setProduct] = useState({ id: '', nombre: '', precio: '' });
    const [cantidad, setQuantity] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString());
    const [ordenId, setOrdenSeleccionada] = useState('');

    const { user, getUser } = useAuthStore((state) => state);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user, getUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productosResponse = await getProductos();
                const categoriasResponse = await getCategorias();
                const ordenesResponse = await getOrdenes();
                setProductos(productosResponse);
                setCategorias(categoriasResponse);
                setOrders(ordenesResponse);
            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (categoriaSeleccionada) {
            const filtrados = productos.filter((prod) => prod.categoriaId === parseInt(categoriaSeleccionada));
            setProductosFiltrados(filtrados);
        } else {
            setProductosFiltrados(productos);
        }
    }, [categoriaSeleccionada, productos]);

    const handleCreateOrder = async (e) => {
        e.preventDefault();

        const usuarioId = user?.id;
        if (!usuarioId || !fecha) {
            setMessage('Faltan datos para crear la orden.');
            return;
        }

        try {
            const response = await createOrden(usuarioId, new Date(fecha).toISOString());
            setMessage('Orden creada con éxito');
            setOrders((prevOrders) => [...prevOrders, response]);
            resetForm();
        } catch (error) {
            console.error(error);
            setMessage('Error al crear la orden');
        }
    };

    const handleCreateDetalleOrden = async (e) => {
        e.preventDefault();
    
        if (!ordenId || !product.id || !cantidad || !valorUnitario) {
            setMessage('Por favor, completa todos los campos del detalle.');
            return;
        }
    

        try {
            const DetalleOrden = {
                ordenId: parseInt(ordenId),
                productoId: parseInt(product.id),
                cantidad: parseInt(cantidad),
                precioUnitario: parseFloat(valorUnitario),
            };
            console.log('Detalles enviados:', DetalleOrden);

            await createDetalleOrden(DetalleOrden);
            setMessage('Detalle agregado con éxito');
    
            const updatedOrders = await getOrdenes();
            setOrders(updatedOrders);
    
            resetForm();
        } catch (error) {
            console.error('Error al agregar el detalle:', error);
            setMessage('Error al agregar el detalle');
        }
    };
    

    const resetForm = () => {
        setProduct({ id: '', nombre: '', precio: '' });
        setQuantity('');
        setValorUnitario('');
        setCategoriaSeleccionada('');
        setFecha(new Date().toISOString());
        setOrdenSeleccionada('');
    };

    const handleViewOrderDetails = async (orderId) => {
        try {

            const response = await getDetallesOrden(orderId);

            alert(`Detalles de la orden: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            console.error('Error al cargar los detalles de la orden:', error);
        }
    };


    return (
        <div className="orders-container">
            <h2>Crear Nueva Orden</h2>
            {user && (
                <form onSubmit={handleCreateOrder}>
                    <div className="input-container">
                        <label>Vendedor:</label>
                        <input type="text" value={user.nombre} readOnly className="vendor-input" />
                        <input type="hidden" value={user.id} id="userIdInput" />
                    </div>

                    <div className='inputFecha'>
                    <input
                        type="datetime-local"
                        value={fecha.slice(0, 16)}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                    </div>


                    <button type="submit">Crear Orden</button>
                </form>
            )}

            <button onClick={() => navigate('/Productos')}>Ver Productos</button>

            <h2>Agregar Detalle a la Orden</h2>
            <form onSubmit={handleCreateDetalleOrden}>
                <div className="input-container">
                    <label>Orden:</label>
                    <select value={ordenId} onChange={(e) => setOrdenSeleccionada(e.target.value)} required>
                        <option value="">Seleccionar orden</option>
                        {orders.map((orden) => (
                            <option key={orden.id} value={orden.id}>{`Orden #${orden.id}`}</option>
                        ))}
                    </select>
                </div>

                <div className="input-container">
                    <label>Categoría:</label>
                    <select
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="input-container">
                    <label>Producto:</label>
                    <select
                        value={product.id}
                        onChange={(e) =>
                            setProduct({
                                id: e.target.value,
                                nombre: e.target.options[e.target.selectedIndex].text,
                                precio: e.target.options[e.target.selectedIndex].dataset.precio,
                            })
                        }
                        required
                    >
                        <option value="">Seleccionar producto</option>
                        {productosFiltrados.map((prod) => (
                            <option key={prod.id} value={prod.id} data-precio={prod.precio}>
                                {prod.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-container">
                    <div className='InputCantidad'><label>Cantidad:</label>
                    <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => setQuantity(e.target.value > 0 ? e.target.value : '')}
                        placeholder="Cantidad"
                        required
                    /> </div>
                </div>

                <div className="input-container">
                    <div className='InputValor'> <label>Valor Unitario:</label>
                    <input
                        type="number"
                        value={valorUnitario}
                        onChange={(e) => setValorUnitario(e.target.value > 0 ? e.target.value : '')}
                        placeholder="Valor Unitario"
                        required
                    /> </div>
                </div>

                <button type="submit">Agregar Detalle</button>
            </form>

            <h2>Lista de Órdenes</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vendedor ID</th>
                        <th>Productos</th>
                        <th>Categoría</th>
                        <th>Fecha</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.usuarioId}</td>
                            <td>
                                {order.DetalleOrden?.map((detail) => (
                                    <div key={detail.productoId}>
                                        {detail.Producto?.nombre || 'Producto desconocido'} (x{detail.cantidad})
                                    </div>
                                ))}
                            </td>
                            <td>
                                {order.DetalleOrden?.map((detail) => (
                                    <div key={detail.productoId}>
                                        {detail.Producto?.Categoria?.nombre || 'Sin categoría'}
                                    </div>
                                ))}
                            </td>
                            <td>{new Date(order.fecha).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleViewOrderDetails(order.id)}>
                                    Ver Detalle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {message && <p>{message}</p>}
        </div>
    );
};

export default Orders;

