import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import fetchGlobal from "@/lib/fetch-data";
import { useToast } from "@/hooks/use-toast";
import { emailValidate } from "@/lib/form-validation";

const initialData = {
  full_name: "",
  email: "",
  password: "",
  phone_number: "",
};

const RegisterUserComponent = ({
  openDialog,
  setOpenDialog,
  type,
  data,
  setData,
  reFetch,
}) => {
  const id = useId();
  const { toast } = useToast();

  // Initialize state
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setOpenDialog(false);
    setData();
    setUser(initialData);
    setError("");
    setIsVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    const temp = emailValidate(user.email);
    if (temp) {
      setError(temp);
      return;
    }

    try {
      let endpoint;
      let options;
      setError("");
      setLoading(true);

      if (type === "add") {
        endpoint = "/v1/register";
        options = {
          method: "POST",
          body: JSON.stringify(user),
        };
      } else {
        delete user.password;

        const userId = data.id;
        endpoint = `/v1/update-user/${userId}`;
        options = {
          method: "PATCH",
          body: JSON.stringify(user),
        };
      }

      const result = await fetchGlobal(endpoint, options, true);
      setLoading(false);
      if (result) {
        toast({
          title:
            type === "add"
              ? "User created successfully! 🎉"
              : "User updated successfully! ✅",
          description:
            type === "add"
              ? "Now the new user will able to access to the reign dashboard"
              : "",
          variant: "default",
          className: "bg-emerald-50 text-black",
        });
        reFetch();
        handleClose();
      }
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (type === "edit" && data) {
      setUser({
        full_name: data.full_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
      });
    }
  }, [type, data]);

  return (
    <Dialog open={openDialog} onOpenChange={handleClose}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Register New Staff
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              By creating a new account, you grant full access to this account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-full_name`}>Full name</Label>
              <Input
                id={`${id}-full_name`}
                placeholder="Matt Welsh"
                name="full_name"
                value={user.full_name || ""}
                onChange={handleChange}
                type="text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="alex@gmail.com"
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            {type !== "edit" && (
              <div className="space-y-2">
                <Label htmlFor={`${id}-password`}>Password</Label>
                <div className="relative">
                  <Input
                    id={`${id}-password`}
                    className="pe-9"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    name="password"
                    value={user.password || ""}
                    onChange={handleChange}
                    required
                  />
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
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
            )}

            <div className="space-y-2">
              <Label htmlFor={`${id}-phone_number`}>Phone Number</Label>
              <Input
                id={`${id}-phone_number`}
                placeholder="08XXXXXXXXXX"
                name="phone_number"
                value={user.phone_number || ""}
                onChange={handleChange}
                type="text"
                required
              />
            </div>
          </div>
          {error && (
            <div className="text-start mt-0">
              <span className="text-destructive text-sm text-end">{error}</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default RegisterUserComponent;
