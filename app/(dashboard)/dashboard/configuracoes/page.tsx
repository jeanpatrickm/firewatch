"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Mail,
  Smartphone,
  Volume2,
  Eye,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [criticalOnly, setCriticalOnly] = useState(false)

  // Alert thresholds
  const [tempThreshold, setTempThreshold] = useState([45])
  const [humidityThreshold, setHumidityThreshold] = useState([30])

  // Accessibility
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="perfil" className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="alertas" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="acessibilidade" className="gap-2">
            <Eye className="h-4 w-4" />
            Acessibilidade
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="perfil">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>Atualize suas informações pessoais e de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <Button variant="outline" size="sm">Alterar Foto</Button>
                  <p className="mt-1 text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue={user?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" placeholder="+55 (11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select defaultValue={user?.role || "operator"}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="operator">Operador</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Shield className="h-4 w-4" />
                  Segurança
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="justify-start">
                    Alterar Senha
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Autenticação em Dois Fatores
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notificacoes">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>Configure como deseja receber alertas e atualizações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Notificações por Email</p>
                      <p className="text-sm text-muted-foreground">Receba alertas no seu email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Notificações por SMS</p>
                      <p className="text-sm text-muted-foreground">Receba alertas urgentes via SMS</p>
                    </div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Notificações Push</p>
                      <p className="text-sm text-muted-foreground">Notificações no navegador</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Alertas Sonoros</p>
                      <p className="text-sm text-muted-foreground">Som para alertas críticos</p>
                    </div>
                  </div>
                  <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
                </div>

                <Separator />

                <div className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">Apenas Alertas Críticos</p>
                      <p className="text-sm text-muted-foreground">Receber apenas notificações de alta prioridade</p>
                    </div>
                  </div>
                  <Switch checked={criticalOnly} onCheckedChange={setCriticalOnly} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alertas">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Limites de Alerta
              </CardTitle>
              <CardDescription>Configure os parâmetros para disparo de alertas automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Temperatura Crítica</Label>
                    <span className="rounded-md bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                      {tempThreshold[0]}°C
                    </span>
                  </div>
                  <Slider
                    value={tempThreshold}
                    onValueChange={setTempThreshold}
                    max={80}
                    min={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Alertas serão disparados quando sensores detectarem temperaturas acima deste limite
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Umidade Mínima</Label>
                    <span className="rounded-md bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
                      {humidityThreshold[0]}%
                    </span>
                  </div>
                  <Slider
                    value={humidityThreshold}
                    onValueChange={setHumidityThreshold}
                    max={60}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Alertas de risco serão emitidos quando a umidade estiver abaixo deste valor
                  </p>
                </div>

                <Separator />

                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="mb-3 font-medium text-foreground">Zonas de Monitoramento Prioritário</h4>
                  <div className="space-y-2">
                    {["Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste"].map((zone) => (
                      <div key={zone} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{zone}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="aparencia">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Tema</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                      theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                      theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Escuro</span>
                  </button>
                  <button
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                      theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-6 w-6" />
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base">Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger className="w-full md:w-64">
                    <Globe className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="acessibilidade">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Acessibilidade
              </CardTitle>
              <CardDescription>Configure opções de acessibilidade para melhorar sua experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">Alto Contraste</p>
                    <p className="text-sm text-muted-foreground">Aumenta o contraste das cores para melhor visibilidade</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">Texto Ampliado</p>
                    <p className="text-sm text-muted-foreground">Aumenta o tamanho do texto em toda a interface</p>
                  </div>
                  <Switch checked={largeText} onCheckedChange={setLargeText} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">Reduzir Movimento</p>
                    <p className="text-sm text-muted-foreground">Minimiza animações e transições</p>
                  </div>
                  <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-primary/5 p-4">
                <h4 className="mb-2 font-medium text-foreground">Atalhos de Teclado</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Ir para Dashboard</span>
                    <kbd className="rounded bg-secondary px-2 py-1 font-mono text-xs">Alt + D</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Abrir Mapa</span>
                    <kbd className="rounded bg-secondary px-2 py-1 font-mono text-xs">Alt + M</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ver Alertas</span>
                    <kbd className="rounded bg-secondary px-2 py-1 font-mono text-xs">Alt + A</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alternar Tema</span>
                    <kbd className="rounded bg-secondary px-2 py-1 font-mono text-xs">Alt + T</kbd>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
