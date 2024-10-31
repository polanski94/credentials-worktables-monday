import { create } from 'zustand';

interface ContextState {
  boardId: number | null;
  theme: string;
  boardData: { name: string; description: string };
  itemData: any[];
  setBoardId: (boardId: number) => void;
  setTheme: (theme: string) => void;
  setBoardData: (boardData: { name: string; description: string }) => void;
  setItemData: (itemData: any) => void;
}

export const useContext = create<ContextState>((set) => {
  return {
    boardId: null,
    theme: 'basic',
    boardData: { name: '', description: '' },
    itemData: [],
    setBoardId: (boardId: number) => {
      set({ boardId });
    },
    setBoardData: (boardData: { name: string; description: string }) => {
      set({ boardData });
    },
    setItemData: (itemData: any) => {
      set({ itemData });
    },

    setTheme: (theme: string) => {
      set({ theme });
    },
  };
});
