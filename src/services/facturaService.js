import api from './api';



export const getFacturas = async () => {
  try {
    const response = await api.get(`/getfacturas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }
};


export const getFactura = async (id) => {
  try {
    const response = await api.get(`/getfactura/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la factura con ID ${id}:`, error);
    throw error;
  }
};


export const createFactura = async (facturaData) => {
  try {
    const response = await api.post(`/createfactura`, facturaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear factura:', error);
    throw error;
  }
};
