import api from './api';


export const getOrdenes = async () => {
  try {
    const response = await api.get('/getordenes'); 
    return response.data; 
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    throw error; 
  }
};


export const createOrden = async (usuarioId, productos, fecha) => {
  try {
    const response = await api.post('/createorden', {
      usuarioId, 
      productos,
      fecha,  
    });
    return response.data; 
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error; 
  }
};

export const createDetalleOrden = async (DetalleOrden) => {
  try {
    const response = await api.post('/createordendetalle', DetalleOrden);
    return response.data;
  } catch (error) {
    console.error('Error al crear el detalle de la orden:', error);
    throw error;
  }
};


export const getDetallesOrden = async (id) => {
  try {
    const response = await api.get(`/getdetallesorden/${id}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al obtener los detalles de la orden:', error);
    throw error; 
  }
};


export const deleteOrden = async (id) => {
  try {
    const response = await api.delete(`/deleteorden/${id}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    throw error; 
  }
};
