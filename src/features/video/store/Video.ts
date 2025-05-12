import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Video } from '../types';

interface VideoState {
  data: Video[];
  loading: boolean;
  error: string | null;
  currentItem: Video | null;
  actions: {
    fetch: () => Promise<void>;
    getById: (id: string) => Promise<Video | null>;
    create: (item: Omit<Video, 'id'>) => Promise<void>;
    update: (id: string, updates: Partial<Video>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    setCurrent: (item: Video | null) => void;
  };
}

export const  = create<VideoState>()(
  devtools(
    persist(
      (set, get) => ({
        data: [],
        loading: false,
        error: null,
        currentItem: null,
        actions: {
          fetch: async () => {
            set({ loading: true, error: null });
            try {
              // Implementation
            } catch (error) {
              set({ error: error.message });
            } finally {
              set({ loading: false });
            }
          },
          getById: async (id) => {
            // Implementation
          },
          create: async (item) => {
            // Implementation
          },
          update: async (id, updates) => {
            // Implementation
          },
          delete: async (id) => {
            // Implementation
          },
          setCurrent: (item) => set({ currentItem: item })
        }
      }),
      {
        name: 'video-store',
        partialize: (state) => ({ data: state.data }) // Only persist data
      }
    )
  )
);

// Optional: Export actions separately for easier usage
export const useVideoActions = () => ((state) => state.actions);