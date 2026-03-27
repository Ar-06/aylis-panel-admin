import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import useAuth from "@/context/useAuth";
import type { LoginUser } from "@/types/user.type";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import profile from "../assets/profile.png";

export default function Login() {
  const { login, errors, loading, clearErrors } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<LoginUser>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
    }
  }, [errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors.length) clearErrors();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Por favor, rellena todos los campos");
      return;
    }
    try {
      await login(form);
      toast.success("Bienvenida Lía!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary opacity-5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent opacity-3 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-sm bg-card shadow-lg border-border ">
        <CardHeader>
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={profile} className="object-cover" />
          </Avatar>
          <CardTitle className="text-2xl font-bold text-center">
            AylisScrap
          </CardTitle>
          <CardDescription className="text-center">
            Panel Administrativo
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Correo Electrónico
              </Label>
              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  placeholder="jhondoe@gmail.com"
                  required
                  className="pl-10 bg-muted border-border focus:border-secondary focus:ring-secondary text-foreground placeholder:text-muted-foreground"
                  onChange={handleChange}
                  value={form.email}
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                  value={form.password}
                  disabled={loading}
                  className="pl-10 bg-muted border-border focus:border-secondary focus:ring-secondary text-foreground placeholder:text-muted-foreground"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-primary-foreground font-semibold h-11 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Verificando...</span>
                </div>
              ) : (
                "Entrar al Panel"
              )}
            </Button>

            <Separator />
            <span className="text-sm text-muted-foreground text-center block mt-3">
              ¿Olvidaste tu contraseña? Contacta a soporte
            </span>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
