import { create } from 'zustand'

interface coolStoreState {
  loggedInUser: UserData | undefined
  setLoggedInUser: (loggedInUser:UserData) => void
  clearLoggedInUser: () => void
}

export const useCoolStore = create<coolStoreState>((set) => ({
    loggedInUser: undefined,
    setLoggedInUser: (user: UserData) => set({ loggedInUser: user }),
    clearLoggedInUser: () => set({ loggedInUser: undefined })
}))
