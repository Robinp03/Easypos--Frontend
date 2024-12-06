import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,  
      isAuthenticated: false,

      
      setToken: (token) => set({ token }),

      login: async (credentials) => {
        try {
          const { user, token } = await authService.login(credentials);
          set({ user, token, isAuthenticated: true });
          return { user, token };
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      

      register: async (registrationData) => {
        try {
          await authService.register(registrationData);
        } catch (error) {
          console.error("Registration failed", error);
        }
      },

      getUser: async () => {
        try {
          const response = await authService.getUser(); 
          set({ user: response }); 
        } catch (error) {
          console.error("Error al obtener el usuario", error);
        }
      },
    }),
    {
      name: 'authToken', 
      partialize: (state) => ({ token: state.token }), 
    }
  )
);

export default useAuthStore;



