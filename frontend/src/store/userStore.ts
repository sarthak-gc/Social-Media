import type { UserI } from "@/pages/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  user: UserI;
  setUser: (user: UserI) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        firstName: "",
        email: "",
        middleName: "",
        lastName: "",
        pfp: "",
        userId: "",
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-details",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
