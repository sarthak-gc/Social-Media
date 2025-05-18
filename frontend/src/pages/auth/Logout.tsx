import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logout } from "@/services/auth";
import useAppSettingStore from "@/store/appSettings";

const Logout = () => {
  const setIsLoggedIn = useAppSettingStore().setIsLoggedIn;
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        navigate("/login");
      }
    })();
  }, [navigate, setIsLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Logging out...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Please wait while we log you out.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;
