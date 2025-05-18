import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.1),transparent_50%)]" />

      <div className="absolute w-full h-full">
        <div className="animate-pulse absolute top-20 left-20 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-40" />
        <div className="animate-pulse absolute bottom-20 right-20 w-40 h-40 bg-gray-300 rounded-full blur-3xl opacity-30" />
      </div>

      <Card className="w-[600px] backdrop-blur-sm bg-white/90 shadow-2xl border border-gray-200">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold text-center text-black">
            Welcome to Our Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center space-y-4">
            <p className="text-xl text-gray-700 font-light">
              Join our community to connect, share, and engage with others.
            </p>
            <p className="text-gray-600">
              Discover new perspectives. Create meaningful connections.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => navigate("/register")}
              className="w-full hover:bg-secondary transition-all duration-300 py-6 text-lg"
            >
              Create an Account
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full border-2 hover:bg-secondary  hover:text-white transition-all duration-300 py-6 text-lg"
            >
              Sign In
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-[1px] bg-gray-300" />
              <span className="text-gray-500">or continue with</span>
              <div className="w-16 h-[1px] bg-gray-300" />
            </div>

            <div className="flex justify-center space-x-4">
              <button className="p-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                </svg>
              </button>
              <button className="p-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                </svg>
              </button>
              <button className="p-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            By joining, you agree to our{" "}
            <a href="#" className="underline hover:text-black">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-black">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
