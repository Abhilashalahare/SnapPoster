import api from '../api/axios'; // Assuming api/axios.js is exactly as provided previously

export const designService = {
  getDesigns: async () => {
    const res = await api.get('/designs');
    return res.data;
  },
  getDesignById: async (id) => {
    const res = await api.get(`/designs/${id}`);
    return res.data;
  },
  saveDesign: async (data) => {
    const res = await api.post('/designs', data);
    return res.data;
  },
  updateDesign: async (id, data) => {
    const res = await api.put(`/designs/${id}`, data);
    return res.data;
  }
};