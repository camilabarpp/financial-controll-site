import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResetScroll } from "@/hooks/useResetScroll";

export default function ForgotPassword() {
  useResetScroll();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim()) {
      setError("Preencha o e-mail");
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsLoading(false);
    setSuccess("Enviamos um link de recuperação para seu e-mail.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="pb-6 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Recuperar Senha</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">Informe seu e-mail para receber o link de redefinição</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
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
            {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center mt-2">{success}</p>}
            <Button
              type="submit"
              className="w-full h-11 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
          <div className="mt-6 text-center text-muted-foreground text-sm flex flex-col gap-2">
            <Button
              type="button"
              variant="link"
              className="text-primary text-sm p-0 h-auto"
              onClick={() => navigate("/login")}
            >
              Voltar para login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
