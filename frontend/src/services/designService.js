
import { api } from '../store/useAuthStore'; 

export const designService = {
  
  getDesigns: async () => {
    const response = await api.get('/designs');
    return response.data;
  },

  
  getDesignById: async (id) => {
    const response = await api.get(`/designs/${id}`);
    return response.data;
  },

  
  createDesign: async (designData) => {
    const response = await api.post('/designs', designData);
    return response.data;
  },

  updateDesign: async (id, designData) => {
    const response = await api.put(`/designs/${id}`, designData);
    return response.data;
  },

  deleteDesign: async (id) => {
    const response = await api.delete(`/designs/${id}`);
    return response.data;
  }
};