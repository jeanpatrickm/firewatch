"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Thermometer,
  Droplets,
  Wind,
  MapPin
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts"

// Dados simulados
const alertsData = [
  { hora: "00:00", alertas: 2 },
  { hora: "04:00", alertas: 1 },
  { hora: "08:00", alertas: 5 },
  { hora: "12:00", alertas: 8 },
  { hora: "16:00", alertas: 12 },
  { hora: "20:00", alertas: 6 },
]

const weeklyData = [
  { dia: "Seg", ocorrencias: 3, prevenidos: 12 },
  { dia: "Ter", ocorrencias: 2, prevenidos: 15 },
  { dia: "Qua", ocorrencias: 5, prevenidos: 18 },
  { dia: "Qui", ocorrencias: 1, prevenidos: 20 },
  { dia: "Sex", ocorrencias: 4, prevenidos: 16 },
  { dia: "Sáb", ocorrencias: 2, prevenidos: 14 },
  { dia: "Dom", ocorrencias: 1, prevenidos: 10 },
]

const recentAlerts = [
  { id: 1, location: "Setor A - Zona Norte", severity: "high", time: "5 min atrás", status: "active" },
  { id: 2, location: "Setor C - Zona Sul", severity: "medium", time: "15 min atrás", status: "investigating" },
  { id: 3, location: "Setor B - Zona Leste", severity: "low", time: "1 hora atrás", status: "resolved" },
  { id: 4, location: "Setor D - Zona Oeste", severity: "medium", time: "2 horas atrás", status: "resolved" },
]

const stats = [
  {
    title: "Alertas Ativos",
    value: "3",
    change: "+2 desde ontem",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Áreas Monitoradas",
    value: "24",
    change: "Todas operacionais",
    icon: MapPin,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Incêndios Prevenidos",
    value: "156",
    change: "+12 este mês",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Sensores Online",
    value: "98%",
    change: "486 de 496",
    icon: Activity,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

const weatherData = [
  { label: "Temperatura", value: "32°C", icon: Thermometer, color: "text-chart-4" },
  { label: "Umidade", value: "45%", icon: Droplets, color: "text-chart-3" },
  { label: "Vento", value: "18 km/h", icon: Wind, color: "text-chart-5" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts Timeline */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Alertas nas Últimas 24h</CardTitle>
            <CardDescription>Distribuição de alertas por horário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={alertsData}>
                  <defs>
                    <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="hora" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="alertas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#alertGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Stats */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Resumo Semanal</CardTitle>
            <CardDescription>Ocorrências vs. Incêndios prevenidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="dia" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar dataKey="ocorrencias" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="Ocorrências" />
                  <Bar dataKey="prevenidos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Prevenidos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Alerts */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Alertas Recentes</CardTitle>
                <CardDescription>Últimas detecções do sistema</CardDescription>
              </div>
              <Flame className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-destructive"
                          : alert.severity === "medium"
                          ? "bg-warning"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-foreground">{alert.location}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alert.status === "active"
                        ? "destructive"
                        : alert.status === "investigating"
                        ? "secondary"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {alert.status === "active" 
                      ? "Ativo" 
                      : alert.status === "investigating" 
                      ? "Investigando" 
                      : "Resolvido"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Condições Climáticas</CardTitle>
            <CardDescription>Dados meteorológicos atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-warning/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
                <div>
                  <p className="text-sm font-medium text-foreground">Risco Elevado</p>
                  <p className="text-xs text-muted-foreground">
                    Condições favoráveis para incêndios nas próximas 6 horas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
