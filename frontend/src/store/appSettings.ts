import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingStore {
  theme: "dark" | "light";
  isLoggedIn: boolean;
  setTheme: (theme: "dark" | "light") => void;
  setIsLoggedIn: (val: boolean) => void;
}

const useAppSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      theme: "dark",
      isLoggedIn: false,
      setTheme: (theme) => set({ theme }),
      setIsLoggedIn: (val) => set({ isLoggedIn: val }),
    }),
    {
      name: "app-setting",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAppSettingStore;
