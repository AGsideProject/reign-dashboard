"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { emailValidate } from "@/lib/form-validation";
import fetchGlobal from "@/lib/fetch-data";
import { useRouter } from "next/navigation";

const initialData = {
  email: "",
  password: "",
};

const LoginForm = ({ className, ...props }) => {
  const router = useRouter();
  // Initialize state
  const [payload, setPayload] = useState(initialData);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    const temp = emailValidate(payload.email);
    if (temp) {
      setError(temp);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const result = await fetchGlobal(
        "/v1/login",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );
      setLoading(false);
      if (result) {
        const { access_token, user } = result;
        sessionStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) router.push("/");
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="relative h-20 w-full flex justify-center">
            <img
              src="/images/reignLogo.jpg"
              alt="reign logo"
              className="absolute h-32 top-[-24]"
            />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  value={payload.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    className="pe-9"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    name="password"
                    value={payload.password || ""}
                    onChange={handleChange}
                    required
                  />
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Eye size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-center mb-1">
                  <span className="text-destructive text-sm text-end">
                    {error}
                  </span>
                </div>

                <Button type="submit" className="w-full">
                  {loading ? <div className="loaderV1" /> : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
