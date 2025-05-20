import { useEffect, useState } from "react";
import { getPersonalData } from "@/services/me";
import useAppSettingStore from "@/store/appSettings";

export const useAuth = () => {
  const setIsLoggedIn = useAppSettingStore().setIsLoggedIn;
  const isLoggedIn = useAppSettingStore().isLoggedIn;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getPersonalData();
        if (response.status === "success") {
          setIsLoggedIn(true);
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
