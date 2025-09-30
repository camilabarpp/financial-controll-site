import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import {
  Camera,
  User,
  Lock,
  Mail,
  Shield,
  Trash2,
  Edit3,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { updateUser, changePassword, deleteUser } from "@/services/userService";
import { cn } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { useResetScroll } from "@/hooks/useResetScroll";

const Account = () => {
  useResetScroll();
  const navigate = useNavigate();
  const [imageHover, setImageHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { user, login, logout, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const avatar = ev.target?.result as string;
        setFormData(prev => ({ ...prev, avatar }));
        const body = {
          name: formData.name,
          email: formData.email,
          avatar
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validação em tempo real para o email
    if (field === 'email') {
      if (!value.trim()) {
        setFormErrors(prev => ({
          ...prev,
          email: "Preencha o e-mail"
        }));
      } else if (!validateEmail(value)) {
        setFormErrors(prev => ({
          ...prev,
          email: "Digite um e-mail válido"
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          email: ""
        }));
      }
    }
  };

  const handlePasswordChange = (field: keyof typeof passwordData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPasswordData(prev => {
      const updated = { ...prev, [field]: newValue };
      
      // Validação em tempo real para nova senha
      if (field === 'newPassword' && newValue) {
        if (newValue.length < 6) {
          setPasswordErrors(prev => ({
            ...prev,
            newPassword: "A senha deve ter pelo menos 6 caracteres"
          }));
        } else {
          setPasswordErrors(prev => ({
            ...prev,
            newPassword: ""
          }));
        }
      }
      
      // Validação em tempo real para confirmação
      if (field === 'confirmPassword' && newValue) {
        if (newValue !== updated.newPassword) {
          setPasswordErrors(prev => ({
            ...prev,
            confirmPassword: "As senhas não coincidem"
          }));
        } else {
          setPasswordErrors(prev => ({
            ...prev,
            confirmPassword: ""
          }));
        }
      }

      return updated;
    });
  };

  const handleSaveProfile = async () => {
    let errors = { name: "", email: "" };
    let hasError = false;
    
    if (!formData.name.trim()) {
      errors.name = "Preencha o nome completo";
      hasError = true;
    }
    if (!formData.email.trim()) {
      errors.email = "Preencha o e-mail";
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Digite um e-mail válido";
      hasError = true;
    }
    
    setFormErrors(errors);
    if (hasError) return;

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user?.id.toString(), {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      });
      // Atualiza o contexto do usuário imediatamente
      if (setUser) setUser(updatedUser);
      // Opcional: await login(); // se login() faz fetch do usuário, pode remover se não precisar
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setIsChangingPassword(true);
    let errors = { currentPassword: "", newPassword: "", confirmPassword: "" };
    let hasError = false;
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Digite sua senha atual";
      hasError = true;
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "Digite a nova senha";
      hasError = true;
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Digite a confirmação da senha";
      hasError = true;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      hasError = true;
    }
    if (passwordData.newPassword.length < 6) {
      errors.newPassword = "A senha deve ter pelo menos 6 caracteres";
      hasError = true;
    }

    setPasswordErrors(errors);
    if (hasError) {
      setIsChangingPassword(false);
      return;
    }

    try {
      await changePassword(user?.id.toString(), {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      console.log("Senha alterada com sucesso!");
      
    } catch (error) {
      if (error instanceof Error) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: error.message
        }));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const deletePasswordInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (deleteModalOpen && deletePasswordInputRef.current) {
      // Timeout para garantir que o modal já abriu
      setTimeout(() => {
        deletePasswordInputRef.current?.focus();
      }, 100);
    }
  }, [deleteModalOpen]);
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeletePasswordError("Digite sua senha para confirmar");
      return;
    }
    setIsLoading(true);
    try {
      await deleteUser(user?.id.toString(), { password: deletePassword });
      setDeleteModalOpen(false);
      setDeletePassword("");
      setDeletePasswordError("");
      logout(); // logout from AuthContext
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setDeletePasswordError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div
        className="max-w-3xl mx-auto space-y-8"
        {...(deleteModalOpen ? { inert: "" } : {})}
      >
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative group">
                    <Avatar
                      className="w-32 h-32 shadow-xl border-4 border-background"
                      onMouseEnter={() => setImageHover(true)}
                      onMouseLeave={() => setImageHover(false)}
                    >
                      <AvatarImage src={formData.avatar} alt="avatar" />
                      <AvatarFallback className="text-xl font-semibold">
                        {/* Mostra as iniciais do nome do usuário logado */}
                        {formData.name
                          ? formData.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Ícone de lápis no canto inferior direito */}
                    <span
                      className="absolute bottom-2 right-2 bg-primary rounded-full p-1 shadow-lg flex items-center justify-center"
                      style={{ pointerEvents: "none" }}
                    >
                      <Edit3 className="w-5 h-5 text-white" />
                    </span>
                    <label
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
                        imageHover ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      )}
                    >
                      <Camera className="w-8 h-8 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div className="space-y-2 mt-4">
                    <h2 className="text-2xl font-bold text-primary">{formData.name}</h2>
                    <p className="text-muted-foreground flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{formData.email}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="hidden lg:block">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <Trash2 className="mr-3 h-4 w-4" />
                    Excluir Conta
                  </Button>
                  <DeleteAccountModal
                    open={deleteModalOpen}
                    isLoading={isLoading}
                    password={deletePassword}
                    passwordError={deletePasswordError}
                    showPassword={showDeletePassword}
                    onPasswordChange={value => {
                      setDeletePassword(value);
                      setDeletePasswordError("");
                    }}
                    onShowPasswordToggle={() => setShowDeletePassword(v => !v)}
                    onConfirm={handleDeleteAccount}
                    onCancel={() => {
                      setDeleteModalOpen(false);
                      setDeletePassword("");
                      setDeletePasswordError("");
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Informações Pessoais</CardTitle>
                      <CardDescription>Atualize suas informações básicas</CardDescription>
                    </div>
                  </div>
                  <Edit3 className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      placeholder="Digite seu nome completo"
                      className={`h-11${formErrors.name ? ' border-red-500' : ''}`}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        placeholder="Digite seu e-mail"
                        className={`pl-10 h-11${formErrors.email ? ' border-red-500' : ''}`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={
                    isLoading ||
                    !formData.name.trim() ||
                    !formData.email.trim() ||
                    (
                      user &&
                      formData.name === user.name &&
                      formData.email === user.email &&
                      formData.avatar === user.avatar
                    )
                  }
                  className="w-full md:w-auto h-11 px-8 mt-6"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Lock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Segurança</CardTitle>
                      <CardDescription>Gerencie sua senha</CardDescription>
                    </div>
                  </div>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg">Alterar Senha</h4>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={e => {
                            handlePasswordChange("currentPassword")(e);
                            setPasswordErrors(prev => ({ ...prev, currentPassword: "" }));
                          }}
                          placeholder="Digite sua senha atual"
                          className={`border rounded-lg px-3 py-2 bg-background pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                          disabled={isChangingPassword}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-11 w-11"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={e => {
                            handlePasswordChange("newPassword")(e);
                            setPasswordErrors(prev => ({ ...prev, newPassword: "" }));
                          }}
                          placeholder="Digite sua nova senha"
                          className={`border rounded-lg px-3 py-2 bg-background pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                          disabled={isChangingPassword}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-11 w-11"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={e => {
                            handlePasswordChange("confirmPassword")(e);
                            setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
                          }}
                          placeholder="Confirme sua nova senha"
                          className={`border rounded-lg px-3 py-2 bg-background pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                          disabled={isChangingPassword}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-11 w-11"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <Button 
                      onClick={handleUpdatePassword}
                      disabled={
                        isChangingPassword ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword ||
                        passwordData.newPassword !== passwordData.confirmPassword ||
                        passwordData.newPassword.length < 6
                      }
                      className="w-full md:w-auto h-11 px-8"
                    >
                      {isChangingPassword ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="block lg:hidden">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-3 h-4 w-4" />
                  Excluir Conta
                </Button>
                <DeleteAccountModal
                  open={deleteModalOpen}
                  isLoading={isLoading}
                  password={deletePassword}
                  passwordError={deletePasswordError}
                  showPassword={showDeletePassword}
                  onPasswordChange={value => {
                    setDeletePassword(value);
                    setDeletePasswordError("");
                  }}
                  onShowPasswordToggle={() => setShowDeletePassword(v => !v)}
                  onConfirm={handleDeleteAccount}
                  onCancel={() => {
                    setDeleteModalOpen(false);
                    setDeletePassword("");
                    setDeletePasswordError("");
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;