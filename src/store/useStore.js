import { create } from 'zustand';

const useStore = create((set) => ({
  selectedCamp: null,
  setSelectedCamp: (camp) => set({ selectedCamp: camp }),

  showAddCampForm: false,
  setShowAddCampForm: (show) => set({ showAddCampForm: show }),

  showAnalytics: false,
  setShowAnalytics: (show) => set({ showAnalytics: show }),

  showTerminal: true,
  setShowTerminal: (show) => set({ showTerminal: show }),

  mapClickCoords: null,
  setMapClickCoords: (coords) => set({ mapClickCoords: coords }),

  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now() }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  activeConvoys: [],
  addActiveConvoy: (convoy) => set((state) => ({
    activeConvoys: [...state.activeConvoys, convoy]
  })),
  updateConvoyProgress: (id, progress) => set((state) => ({
    activeConvoys: state.activeConvoys.map((c) =>
      c.id === id ? { ...c, progress } : c
    )
  })),
  removeActiveConvoy: (id) => set((state) => ({
    activeConvoys: state.activeConvoys.filter((c) => c.id !== id)
  })),
}));

export default useStore;