import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { loginService, saveToken } from "@/services/authService";
import { AuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    try {
      const { token } = await loginService({ email, password });
      saveToken(token);
      login(token);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="pb-6 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Entrar</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">Acesse sua conta para controlar suas finanças</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="pl-10 h-11"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="pl-10 h-11 pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <Lock className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
            <Button
              type="submit"
              className="w-full h-11 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 text-center text-muted-foreground text-sm flex flex-col gap-2">
            <span>Esqueceu a senha?{' '}
              <Button
                type="button"
                variant="link"
                className="text-primary text-sm p-0 h-auto"
                onClick={() => navigate("/forgot-password")}
              >
                Recuperar
              </Button>
            </span>
            <Button
              type="button"
              variant="link"
              className="text-primary text-sm p-0 h-auto"
              onClick={() => navigate("/register")}
            >
              Criar conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
