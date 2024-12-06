import api from './api'; 
import useAuthStore from '../stores/authStore'; 

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { user, token } = response.data;

      
      const { setToken } = useAuthStore.getState();
      setToken(token);

      return { user, token };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  register: async (registrationData) => {
    try {
      const response = await api.post('/register', registrationData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  performLogout: () => {
    const { logout } = useAuthStore.getState();
    logout(); 
  },

  getUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};

export default authService;



