import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, Bell, LogIn, LogOut, UserPlus } from "lucide-react";
import useAppSettingStore from "@/store/appSettings";
import useUserStore from "@/store/userStore";

const Navbar = () => {
  const isLoggedIn = useAppSettingStore().isLoggedIn;
  const notifications = useUserStore().notifications;
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <Link to={isLoggedIn ? "/feed" : "/"} className="text-lg font-semibold">
        Socialite
      </Link>

      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/feed">
            <Home className="h-5 w-5" />
          </Link>
        </Button>

        <Button asChild>
          <Link to="/me">
            <User className="h-5 w-5" />
          </Link>
        </Button>

        <Button asChild>
          <div className="relative">
            <Link to="/notifications" className="flex items-center">
              <Bell className="h-5 w-5" />
            </Link>
            {notifications.length > 0 && (
              <span className="text-sm font-semibold aspect-square h-3 rounded-full flex items-center justify-center absolute bottom-0 right-0">
                <h1>{notifications.length}</h1>
              </span>
            )}
          </div>
        </Button>
        {isLoggedIn ? (
          <Button asChild>
            <Link to="/logout">
              <LogOut className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link to="/login">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild>
              <Link to="/register">
                <UserPlus className="h-5 w-5" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
