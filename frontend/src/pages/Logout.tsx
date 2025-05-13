import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(
          "http://localhost:8787/user/logout",
          {},
          {
            withCredentials: true,
          }
        );
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

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
