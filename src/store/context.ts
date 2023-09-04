import { create } from 'zustand';

interface ContextState {
  boardId: number | null;
  theme: string;
  setBoardId: (boardId: number) => void;
  setTheme: (theme: string) => void;
}

export const useContext = create<ContextState>((set) => {
  return {
    boardId: null,
    theme: 'basic',

    setBoardId: (boardId: number) => {
      set({ boardId });
    },

    setTheme: (theme: string) => {
      set({ theme });
    },
  };
});
