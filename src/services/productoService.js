import api from './api';

 

export const getProductos = async () => {
  try {
    const response = await api.get(`/getproducto`);
    return response.data; 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error; 
  }
};


export const createProducto = async (productoData) => {
  try {
    const response = await api.post(`/createproducto`, productoData);
    return response.data; 
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error; 
  }
};


export const updateProducto = async (id, productoData) => {
  try {
    const response = await api.put(`/updateproducto/${id}`, productoData);
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error; 
  }
};


export const deleteProducto = async (id) => {
  try {
    const response = await api.delete(`/deleteproducto/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error; 
  }
};
