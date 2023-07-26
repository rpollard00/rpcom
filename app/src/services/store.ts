import { create } from 'zustand'

interface coolStoreState {
  notifyMsg: string
  setNotifyMsg: (msg: string) => void
  clearNotifyMsg: () => void
}

export const useCoolStore = create<coolStoreState>((set) => ({
    notifyMsg: "",
    setNotifyMsg: (msg) => set({ notifyMsg: msg }),
    clearNotifyMsg: () => set({ notifyMsg: "" })
}))
