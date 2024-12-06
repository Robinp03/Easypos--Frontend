import React, { useState, useEffect } from 'react';
import { getFacturas, getFactura, createFactura } from '../services/facturaService.js';
import { getOrdenes } from '../services/ordenesService.js';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [ordenId, setOrdenId] = useState('');
    const [message, setMessage] = useState('');
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        fetchInvoices();
        fetchOrdenes();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await getFacturas();
            setInvoices(response);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
        }
    };

    const fetchOrdenes = async () => {
        try {
            const response = await getOrdenes();
            setOrdenes(response);
        } catch (error) {
            console.error('Error al cargar órdenes:', error);
        }
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            const response = await createFactura({ ordenId: parseInt(ordenId) });
            setMessage(response.message || 'Factura creada con éxito');
            fetchInvoices();
            setOrdenId('');
        } catch (error) {
            console.error('Error al crear la factura:', error);
            setMessage('Error al crear la factura');
        }
    };

    const handleViewInvoice = async (invoiceId) => {
        try {
            const response = await getFactura(invoiceId);
            alert(`Detalles de la factura: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            console.error('Error al cargar los detalles de la factura:', error);
        }
    };

    const handlePrintInvoice = async (invoiceId) => {
        try {
            const invoice = await getFactura(invoiceId); 
    
        
            const productDetails = invoice.Orden?.DetalleOrden?.map((detail) => {
                const productName = detail.Producto?.nombre || 'Producto desconocido';
                const categoryName = detail.Producto?.Categoria?.nombre || 'Sin categoría';
                const unitPrice = Number(detail.precioUnitario || 0).toFixed(2);
                const quantity = detail.cantidad;
    
                return `
                Producto: ${productName}
                Categoría: ${categoryName}
                Precio Unitario: $${unitPrice}
                Cantidad: ${quantity}
                `;
            }).join('\n');
    
            const invoiceDetails = `
            Factura ID: ${invoice.id}
            Fecha: ${new Date(invoice.fecha).toLocaleDateString()}
            Orden ID: ${invoice.ordenId}
            Vendedor ID: ${invoice.Orden?.Usuario?.id || 'Sin usuario'}
            Nombre vendedor: ${invoice.Orden?.Usuario?.nombre || 'Desconocido'}
            
            Detalles de Productos:
            ${productDetails}
    
            Subtotal: $${Number(invoice.subtotal || 0).toFixed(2)}
            IVA: $${Number(invoice.iva || 0).toFixed(2)}
            Total: $${Number(invoice.total || 0).toFixed(2)}
            `;
    
            const newWindow = window.open('', '_blank');
            newWindow.document.write('<pre>' + invoiceDetails + '</pre>');
            newWindow.document.close();
            newWindow.print();
        } catch (error) {
            console.error('Error al imprimir la factura:', error);
        }
    };
    

    return (
        <div className="invoices-container">
            <h2>Generar Nueva Factura</h2>
            <form onSubmit={handleCreateInvoice}>
                <h4 htmlFor="ordenId">ID de la Orden</h4>
                <select
                    id="ordenId"
                    value={ordenId}
                    onChange={(e) => setOrdenId(e.target.value)}
                    required
                >
                    <option value="">Seleccione una Orden</option>
                    {ordenes.map((orden) => (
                        <option key={orden.id} value={orden.id}>
                            {`Orden #${orden.id}`}
                        </option>
                    ))}
                </select>
                 <div className='GenerarFactura'>
                <button type="submit">Generar Factura</button> </div>
            </form>
            {message && <p>{message}</p>}

            <h2>Lista de Facturas</h2>
            <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID de la Orden</th>
                        <th>ID del Usuario</th>
                        <th>Fecha</th>
                        <th>Nombre del Producto</th>
                        <th>Categoría</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>IVA</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.ordenId}</td>
                            <td>{invoice.Orden?.Usuario?.id || 'Sin usuario'}</td>
                            <td>{new Date(invoice.fecha).toLocaleDateString()}</td>
                            <td>
                                {invoice.Orden?.DetalleOrden?.map((detail) => (
                                    <div key={detail.id}>
                                        {detail.Producto?.nombre || 'Producto desconocido'}
                                    </div>
                                ))}
                            </td>
                            <td>
                                {invoice.Orden?.DetalleOrden?.map((detail) => (
                                    <div key={detail.id}>
                                        {detail.Producto?.Categoria?.nombre || 'Sin categoría'}
                                    </div>
                                ))}
                            </td>
                            <td>
                                {invoice.Orden?.DetalleOrden?.map((detail) => (
                                    <div key={detail.id}>
                                        ${Number(detail.precioUnitario).toFixed(2)}
                                    </div>
                                ))}
                            </td>
                            <td>${Number(invoice.subtotal || 0).toFixed(2)}</td>
                            <td>${Number(invoice.iva || 0).toFixed(2)}</td>
                            <td>${Number(invoice.total || 0).toFixed(2)}</td>
                            <td>
                                <button onClick={() => handleViewInvoice(invoice.id)}>Ver Detalle</button>
                                <button onClick={() => handlePrintInvoice(invoice.id)}>Imprimir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Invoices;
