import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error de login:', error);
    throw new Error('Credenciales incorrectas');
  }
};

export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/announcements`); // Ruta de anuncios
    return response.data;
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    throw new Error('No se pudieron obtener los anuncios');
  }
};
