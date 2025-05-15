import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, Bell, LogIn, LogOut, UserPlus } from "lucide-react";

const Navbar = () => {
  const isLoggedIn = true;

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <Link to="/" className="text-lg font-semibold">
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
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
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
