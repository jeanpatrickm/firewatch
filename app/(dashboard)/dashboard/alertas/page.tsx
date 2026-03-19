"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Filter,
  Search,
  MapPin,
  Thermometer,
  Users,
  Phone,
  Mail,
  ExternalLink,
  MoreHorizontal
} from "lucide-react"

// Dados simulados de alertas
const alertsData = [
  {
    id: 1,
    title: "Ponto de Calor Detectado",
    description: "Temperatura anormal identificada na região do Setor A",
    location: "Setor A - Zona Norte",
    coordinates: "-23.5505, -46.6333",
    temperature: 68,
    severity: "critical",
    status: "active",
    timestamp: "2024-01-15T14:30:00",
    assignedTo: "Brigada 01",
    actions: ["Equipe despachada", "Monitoramento ativo"],
  },
  {
    id: 2,
    title: "Elevação de Temperatura",
    description: "Aumento gradual de temperatura detectado em múltiplos sensores",
    location: "Setor C - Zona Sul",
    coordinates: "-23.5605, -46.6433",
    temperature: 52,
    severity: "high",
    status: "investigating",
    timestamp: "2024-01-15T13:45:00",
    assignedTo: "Brigada 02",
    actions: ["Investigação em andamento"],
  },
  {
    id: 3,
    title: "Sensor em Alerta",
    description: "Sensor B1 detectou fumaça na área de cobertura",
    location: "Setor B - Zona Leste",
    coordinates: "-23.5405, -46.6533",
    temperature: 45,
    severity: "medium",
    status: "monitoring",
    timestamp: "2024-01-15T12:15:00",
    assignedTo: null,
    actions: ["Aguardando confirmação visual"],
  },
  {
    id: 4,
    title: "Condições Favoráveis a Incêndio",
    description: "Baixa umidade e alta temperatura previstas para as próximas horas",
    location: "Todos os setores",
    coordinates: "Área completa",
    temperature: 35,
    severity: "low",
    status: "monitoring",
    timestamp: "2024-01-15T10:00:00",
    assignedTo: null,
    actions: ["Alerta preventivo emitido"],
  },
  {
    id: 5,
    title: "Incêndio Controlado",
    description: "Foco de incêndio foi contido pela Brigada 03",
    location: "Setor D - Zona Oeste",
    coordinates: "-23.5705, -46.6233",
    temperature: 28,
    severity: "resolved",
    status: "resolved",
    timestamp: "2024-01-15T08:30:00",
    assignedTo: "Brigada 03",
    actions: ["Incêndio controlado", "Área monitorada", "Relatório finalizado"],
  },
]

const stats = [
  { label: "Alertas Ativos", value: 2, icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
  { label: "Em Investigação", value: 1, icon: Search, color: "text-warning", bgColor: "bg-warning/10" },
  { label: "Monitorando", value: 1, icon: Clock, color: "text-chart-3", bgColor: "bg-chart-3/10" },
  { label: "Resolvidos Hoje", value: 5, icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
]

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "critical":
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Crítico</Badge>
    case "high":
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Alto</Badge>
    case "medium":
      return <Badge className="bg-accent/20 text-accent-foreground hover:bg-accent/30">Médio</Badge>
    case "low":
      return <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/20">Baixo</Badge>
    case "resolved":
      return <Badge className="bg-success/10 text-success hover:bg-success/20">Resolvido</Badge>
    default:
      return <Badge variant="secondary">Desconhecido</Badge>
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="destructive">Ativo</Badge>
    case "investigating":
      return <Badge className="bg-warning text-warning-foreground">Investigando</Badge>
    case "monitoring":
      return <Badge variant="secondary">Monitorando</Badge>
    case "resolved":
      return <Badge variant="outline">Resolvido</Badge>
    default:
      return <Badge variant="secondary">-</Badge>
  }
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (minutes < 60) {
    return `${minutes} min atrás`
  } else if (hours < 24) {
    return `${hours}h atrás`
  } else {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }
}

export default function AlertasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedAlert, setSelectedAlert] = useState<typeof alertsData[0] | null>(null)

  const filteredAlerts = alertsData.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Alerts List */}
        <div className="flex-1">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Central de Alertas
                  </CardTitle>
                  <CardDescription>Gerencie e acompanhe todos os alertas do sistema</CardDescription>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar alertas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Severidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <button
                      key={alert.id}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        selectedAlert?.id === alert.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:bg-secondary/50"
                      }`}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                          <h3 className="font-medium text-foreground">{alert.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(alert.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Thermometer className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-foreground">{alert.temperature}°C</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="active" className="space-y-3">
                  {filteredAlerts
                    .filter((a) => a.status === "active" || a.status === "investigating")
                    .map((alert) => (
                      <button
                        key={alert.id}
                        className={`w-full rounded-lg border p-4 text-left transition-colors ${
                          selectedAlert?.id === alert.id
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:bg-secondary/50"
                        }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                            <h3 className="font-medium text-foreground">{alert.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </TabsContent>

                <TabsContent value="resolved" className="space-y-3">
                  {filteredAlerts
                    .filter((a) => a.status === "resolved")
                    .map((alert) => (
                      <button
                        key={alert.id}
                        className={`w-full rounded-lg border p-4 text-left transition-colors ${
                          selectedAlert?.id === alert.id
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:bg-secondary/50"
                        }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                            <h3 className="font-medium text-foreground">{alert.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Alert Details */}
        <div className="w-full shrink-0 lg:w-96">
          <Card className="sticky top-24 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Detalhes do Alerta</CardTitle>
              <CardDescription>
                {selectedAlert
                  ? "Informações completas do alerta selecionado"
                  : "Selecione um alerta para ver detalhes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAlert ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground">{selectedAlert.title}</h3>
                    <div className="mt-2 flex gap-2">
                      {getSeverityBadge(selectedAlert.severity)}
                      {getStatusBadge(selectedAlert.status)}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Localização
                      </span>
                      <span className="text-sm font-medium text-foreground">{selectedAlert.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Thermometer className="h-4 w-4" />
                        Temperatura
                      </span>
                      <span className="text-sm font-medium text-foreground">{selectedAlert.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Detectado
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formatTimestamp(selectedAlert.timestamp)}
                      </span>
                    </div>
                    {selectedAlert.assignedTo && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Responsável
                        </span>
                        <span className="text-sm font-medium text-foreground">{selectedAlert.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">Ações Realizadas</h4>
                    <ul className="space-y-2">
                      {selectedAlert.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-border pt-4">
                    <Button className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Ver no Mapa
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        Ligar
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Clique em um alerta na lista para visualizar seus detalhes completos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
