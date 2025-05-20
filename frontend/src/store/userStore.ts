import type { NotificationI, UserI } from "@/pages/types/types";
import { getAllNotifications } from "@/services/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  user: UserI;
  notifications: NotificationI[];
  unReadCount: number;
  isPending: boolean;
  error: Error | null;
  setUser: (user: UserI) => void;
  setNotifications: (notifications: NotificationI[]) => void;
  setPending: (isPending: boolean) => void;
  setError: (error: Error | null) => void;
  fetchNotifications: () => Promise<void>;
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
      notifications: [],
      unReadCount: 0,
      isPending: false,
      error: null,
      setUser: (user) => set({ user }),
      setNotifications: (notifications) => set({ notifications }),
      setPending: (isPending) => set({ isPending }),
      setError: (error) => set({ error }),
      fetchNotifications: async () => {
        set({ isPending: true });
        try {
          const response = await getAllNotifications();

          const notifications = response.data.notifications;
          set({ notifications });

          const unReadCount = response.data.unReadCount;
          set({ unReadCount });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error("Unknown error"),
          });
        } finally {
          set({ isPending: false });
        }
      },
    }),
    {
      name: "user-details",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
