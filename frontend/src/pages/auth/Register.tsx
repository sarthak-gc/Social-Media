import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { register } from "@/services/auth";
import { Input } from "@/components/ui/input";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { status, data } = await register(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.middleName
      );

      if (status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/feed");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <Input
              id="middleName"
              type="text"
              value={form.middleName}
              onChange={handleChange}
              placeholder="Enter your middle name"
            />
            <Input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4">
          <span>
            <span>Already have an account?</span>
            <Link className="ml-1  underline" to="/login">
              Login
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
