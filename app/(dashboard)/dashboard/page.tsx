"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchFireData } from "@/lib/fire-service"
import { 
  Flame, AlertTriangle, CheckCircle2, Activity, MapPin
} from "lucide-react"
import { 
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [fireData, setFireData] = useState<any>({ nasa: [], inpe: [] })
  const [error, setError] = useState(false)
  
  // Novo estado para controlar a visualização do gráfico da NASA
  const [timeRange, setTimeRange] = useState("24h")

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchFireData()
        setFireData(data)
      } catch (err) {
        console.error("Erro ao carregar dados das APIs:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // PARSEAMENTO DINÂMICO: Alterna os dados do gráfico baseado na seleção (24h, 30d, 1y)
  const chartData = useMemo(() => {
    if (timeRange === "24h") {
      // 24 Horas: Usa os dados reais da API da NASA (agrupados por hora)
      const hours = Array.from({ length: 6 }, (_, i) => `${i * 4}:00`)
      return hours.map(h => ({
        periodo: h,
        alertas: fireData.nasa.filter((f: any) => f.acq_time?.startsWith(h.split(':')[0].padStart(2, '0'))).length || null
      }))
    } 
    else if (timeRange === "30d") {
      // 30 Dias: Retorna vazio se não houver dados suficientes
      return []
    } 
    else if (timeRange === "1y") {
      // 1 Ano: Retorna vazio se não houver dados
      return []
    }
    return []
  }, [fireData.nasa, timeRange])

  // PARSEAMENTO: Alertas Recentes baseados nos últimos focos detectados
  const recentAlerts = useMemo(() => {
    if (!fireData.nasa || fireData.nasa.length === 0) return [];
    return fireData.nasa.slice(0, 4).map((f: any, i: number) => ({
      id: i,
      location: `Lat: ${Number(f.latitude).toFixed(4)}, Lon: ${Number(f.longitude).toFixed(4)}`,
      severity: Number(f.bright_ti4) > 330 ? "high" : "medium",
      time: `${f.acq_date} ${f.acq_time}`,
      status: "active"
    }))
  }, [fireData.nasa])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Focos Ativos (24h)",
      value: fireData.nasa.length.toString() || null,
      change: "Dados NASA FIRMS",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Áreas Críticas",
      value: (fireData.nasa.filter((f: any) => f.confidence === 'h' || f.confidence === 'high').length || null),
      change: "Alta confiança satelital",
      icon: Flame,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Monitoramento INPE",
      value: "-",
      change: "Aguardando dados",
      icon: MapPin,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Status do Sistema",
      value: "98%",
      change: "Sensores em órbita",
      icon: Activity,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value === null ? "-" : typeof stat.value === "number" ? stat.value : stat.value}
                  </p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          {/* CABEÇALHO DO GRÁFICO ATUALIZADO COM OS TABS */}
          <CardHeader className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Anomalias Térmicas (NASA)</CardTitle>
              <CardDescription>Distribuição de focos de calor</CardDescription>
            </div>
            <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full sm:w-[250px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="30d">Mês</TabsTrigger>
                <TabsTrigger value="1y">Ano</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] mt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="periodo" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="alertas" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#alertGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Alertas Recentes */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Focos Detectados Recentemente</CardTitle>
            <CardDescription>Dados táticos processados do INPE/NASA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {recentAlerts.length > 0 ? recentAlerts.map((alert: any) => (
                <div key={alert.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${alert.severity === "high" ? "bg-destructive" : "bg-warning"}`} />
                    <div>
                      <p className="font-medium text-foreground">{alert.location}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                    {alert.severity === "high" ? "Crítico" : "Ativo"}
                  </Badge>
                </div>
              )) : <p className="text-sm text-muted-foreground">Nenhum foco crítico detectado no momento.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}