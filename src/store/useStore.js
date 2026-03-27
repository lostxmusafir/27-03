import { create } from 'zustand';

const useStore = create((set) => ({
  selectedCamp: null,
  setSelectedCamp: (camp) => set({ selectedCamp: camp }),
  
  showAddCampForm: false,
  setShowAddCampForm: (show) => set({ showAddCampForm: show }),
  
  mapClickCoords: null,
  setMapClickCoords: (coords) => set({ mapClickCoords: coords }),
  
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now() }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));

export default useStore;