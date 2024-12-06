import api from './api';

export const getCategorias = async () => {
  try {
    const response = await api.get('/getcategorias'); 
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};
