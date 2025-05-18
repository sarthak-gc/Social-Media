import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import Welcome from "./pages/general/Welcome.tsx";

import Feed from "./pages/app/Feed.tsx";

import NotFound from "./pages/general/NotFound.tsx";
import User from "./pages/users/Profile.tsx";
import Self from "./components/User/Self";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth.tsx";
import Image from "./pages/Post/Image.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import Sent from "./pages/requests/Sent.tsx";
import Received from "./pages/requests/Received.tsx";
import Logout from "./pages/auth/Logout.tsx";
import Register from "./pages/auth/Register.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Notifications from "./pages/users/Notifications.tsx";
import Post from "./pages/Post/Post.tsx";

const queryClient = new QueryClient();

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
      path: "/notifications",
      element: (
        <Layout>
          <Notifications />
        </Layout>
      ),
    },
    {
      path: "/post/:postId",
      element: (
        <Layout>
          <Post />
        </Layout>
      ),
    },
    {
      path: "/me",
      element: (
        <Layout>
          <Self />
          <Toaster />
        </Layout>
      ),
      children: [
        {
          path: "/me/sent",
          element: <Sent />,
        },
        {
          path: "/me/received",
          element: <Received />,
        },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routers} />
    </QueryClientProvider>
  );
};

export default App;
