import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Friends from "./pages/Friends";
import Feed from "./pages/Feed";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import User from "./pages/User";
import Self from "./components/User/Self";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth.tsx";
import Image from "./components/Post/Image.tsx";

const App = () => {
  const Layout = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    return (
      <>
        <Navbar />
        {children}
      </>
    );
  };

  const routers = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "/login", element: <Login /> },
    { path: "/logout", element: <Logout /> },
    { path: "/register", element: <Register /> },
    {
      path: "/feed",
      element: (
        <Layout>
          <Feed />
        </Layout>
      ),
    },
    {
      path: "/friends",
      element: (
        <Layout>
          <Friends />
        </Layout>
      ),
    },
    {
      path: "/user/:userId",
      element: (
        <Layout>
          <User />
        </Layout>
      ),
    },
    {
      path: "/image/:imageId",
      element: <Image />,
    },
    {
      path: "/me",
      element: (
        <Layout>
          <Self />
        </Layout>
      ),
    },
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={routers} />;
};

export default App;
