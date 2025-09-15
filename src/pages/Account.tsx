import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Camera,
  User,
  Lock,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Save,
  Pencil,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [formData, setFormData] = useState({
    name: "Camila Barpp",
    email: "camila@email.com",
    phone: "(51) 99999-9999",
    birthDate: new Date("1990-01-01")
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [date, setDate] = useState<Date>(formData.birthDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulando salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Perfil atualizado", {
        description: "Suas informações foram salvas com sucesso."
      });
      
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar", {
        description: "Não foi possível salvar suas informações."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handlePasswordChange = (field: keyof typeof passwordData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleUpdatePassword = async () => {
    setIsChangingPassword(true);
    try {
      // Validações
      if (!passwordData.currentPassword) {
        throw new Error("Digite sua senha atual");
      }
      if (!passwordData.newPassword) {
        throw new Error("Digite a nova senha");
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      // Simulando atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Senha atualizada", {
        description: "Sua senha foi alterada com sucesso."
      });

      // Limpa os campos
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error("Erro ao atualizar senha", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container max-w-5xl py-12">
        <div className="grid gap-10 md:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <Avatar
                      className="w-28 h-28 shadow-xl"
                      onMouseEnter={() => setImageHover(true)}
                      onMouseLeave={() => setImageHover(false)}
                    >
                      <AvatarImage src="https://github.com/camilabarpp.png" alt="@camilabarpp" />
                      <AvatarFallback>CB</AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
                        imageHover ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      )}
                    >
                      <Camera className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-primary">{formData.name}</h2>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                </div>
              </CardContent>
            </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Digite seu nome completo"
                className="w-full"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  placeholder="Digite seu e-mail"
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label>Data de nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString('pt-BR') : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Botão Salvar */}
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Security Settings */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Gerencie sua senha e autenticação</CardDescription>
                  </div>
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Senha Atual */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange("currentPassword")}
                      placeholder="Digite sua senha atual"
                      className="w-full"
                      disabled={isChangingPassword}
                    />
                  </div>

                  {/* Nova Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange("newPassword")}
                      placeholder="Digite sua nova senha"
                      className="w-full"
                      disabled={isChangingPassword}
                    />
                  </div>

                  {/* Confirmar Nova Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange("confirmPassword")}
                      placeholder="Confirme sua nova senha"
                      className="w-full"
                      disabled={isChangingPassword}
                    />
                  </div>

                  {/* Botão Alterar Senha */}
                  <Button 
                    className="w-full" 
                    onClick={handleUpdatePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Verificação em Duas Etapas</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adicione uma camada extra de segurança à sua conta.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Configurar 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;