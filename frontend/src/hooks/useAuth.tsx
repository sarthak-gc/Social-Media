import { useEffect, useState } from "react";
import { getPersonalData } from "@/services/me";
import useAppSettingStore from "@/store/appSettings";
import useUserStore from "@/store/userStore";

export const useAuth = () => {
  const setIsLoggedIn = useAppSettingStore().setIsLoggedIn;
  const isLoggedIn = useAppSettingStore().isLoggedIn;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const setUser = useUserStore.getState().setUser;
      const user = useUserStore.getState().user.firstName;
      try {
        if (!user) {
          const response = await getPersonalData();
          if (response.status === "success") {
            setUser(response.data.me);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setIsLoggedIn]);

  return { isLoggedIn, loading };
};
