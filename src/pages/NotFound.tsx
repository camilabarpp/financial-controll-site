import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { useResetScroll } from "@/hooks/useResetScroll";

const NotFound = () => {
  useResetScroll();
  const location = useLocation();

  useEffect(() => {
    console.error("Erro 404: Usuário tentou acessar rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary mb-2 
          animate-in slide-in-from-top duration-500">
          404
        </h1>

        <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full" />

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground">
            Desculpe, não encontramos a página que você está procurando. 
            A página pode ter sido removida ou o link pode estar quebrado.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/">
            <Button 
              variant="default" 
              className="transition-all hover:scale-105"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Voltar para o Início
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-muted-foreground/60 font-mono">
          {location.pathname}
        </div>
      </div>
    </div>
  );
};

export default NotFound;