"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFireData } from "@/lib/fire-service"
import { 
  Flame, AlertTriangle, CheckCircle2, Activity,
  Thermometer, Droplets, Wind, MapPin
} from "lucide-react"
import { 
  Area, AreaChart, Bar, BarChart, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [fireData, setFireData] = useState<any>({ nasa: [], inpe: [] })
  const [error, setError] = useState(false)

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

  const nasaAlerts = Array.isArray(fireData.nasa) ? fireData.nasa : []

  // PARSEAMENTO: Transforma dados brutos da NASA para o Gráfico de Área (Alertas por hora)
  const chartData = useMemo(() => {
    const hours = Array.from({ length: 6 }, (_, i) => `${String(i * 4).padStart(2, '0')}:00`)
    return hours.map(h => ({
      hora: h,
      alertas: nasaAlerts.filter((f: any) => String(f.acq_time ?? '').startsWith(h.slice(0, 2))).length
    }))
  }, [nasaAlerts])

  // PARSEAMENTO: Alertas Recentes baseados nos últimos focos detectados
  const recentAlerts = useMemo(() => {
    return nasaAlerts.slice(0, 4).map((f: any, i: number) => ({
      id: i,
      location: `Lat: ${f.latitude}, Lon: ${f.longitude}`,
      severity: f.bright_ti4 > 330 ? "high" : "medium",
      time: `${f.acq_date} ${f.acq_time}`,
      status: "active"
    }))
  }, [nasaAlerts])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Focos Ativos (24h)",
      value: nasaAlerts.length.toString(),
      change: "Dados NASA FIRMS",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Áreas Críticas",
      value: nasaAlerts.filter((f: any) => f.confidence === 'h').length.toString(),
      change: "Alta confiança satelital",
      icon: Flame,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Monitoramento INPE",
      value: "Amazônia",
      change: "Bioma Principal",
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
      {/* Cards de Estatísticas */}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Linha do Tempo */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Anomalias Térmicas (NASA)</CardTitle>
            <CardDescription>Distribuição de focos por horário nas últimas 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="hora" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="alertas" stroke="hsl(var(--primary))" fill="url(#alertGradient)" />
                </AreaChart>
              </ResponsiveContainer>
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
            <div className="space-y-4">
              {recentAlerts.length > 0 ? recentAlerts.map((alert: any) => (
                <div key={alert.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${alert.severity === "high" ? "bg-destructive" : "bg-warning"}`} />
                    <div>
                      <p className="font-medium text-foreground">{alert.location}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>Ativo</Badge>
                </div>
              )) : <p className="text-sm text-muted-foreground">Nenhum foco crítico detectado no momento.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}