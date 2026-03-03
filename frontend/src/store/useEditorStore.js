import { create } from 'zustand';

const useEditorStore = create((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
}));

export default useEditorStore;