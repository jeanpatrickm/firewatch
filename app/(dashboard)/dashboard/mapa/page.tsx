"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Locate,
  Flame,
  Thermometer,
  AlertTriangle,
  Radio,
  Eye,
  EyeOff
} from "lucide-react"

// Dados simulados de sensores e pontos de calor
const sensors = [
  { id: 1, name: "Sensor A1", lat: -23.5505, lng: -46.6333, status: "online", temp: 28 },
  { id: 2, name: "Sensor A2", lat: -23.5605, lng: -46.6433, status: "online", temp: 32 },
  { id: 3, name: "Sensor B1", lat: -23.5405, lng: -46.6533, status: "warning", temp: 45 },
  { id: 4, name: "Sensor B2", lat: -23.5705, lng: -46.6233, status: "online", temp: 26 },
  { id: 5, name: "Sensor C1", lat: -23.5305, lng: -46.6633, status: "offline", temp: 0 },
]

const heatPoints = [
  { id: 1, lat: -23.5505, lng: -46.6333, intensity: "high", area: "Setor A" },
  { id: 2, lat: -23.5605, lng: -46.6433, intensity: "medium", area: "Setor B" },
  { id: 3, lat: -23.5405, lng: -46.6533, intensity: "low", area: "Setor C" },
]

const zones = [
  { id: 1, name: "Zona Norte", sensors: 12, alerts: 2, status: "warning" },
  { id: 2, name: "Zona Sul", sensors: 15, alerts: 0, status: "normal" },
  { id: 3, name: "Zona Leste", sensors: 10, alerts: 1, status: "warning" },
  { id: 4, name: "Zona Oeste", sensors: 8, alerts: 0, status: "normal" },
]

export default function MapaPage() {
  const [showSensors, setShowSensors] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [zoom, setZoom] = useState(100)

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Map Area */}
      <div className="relative flex-1 overflow-hidden rounded-xl border border-border bg-secondary/30">
        {/* Map Controls */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <Card className="border-border/50 bg-card/95 backdrop-blur">
            <CardContent className="p-2">
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setZoom(Math.min(zoom + 10, 150))}
                  aria-label="Aumentar zoom"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="text-center text-xs text-muted-foreground">{zoom}%</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setZoom(Math.max(zoom - 10, 50))}
                  aria-label="Diminuir zoom"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <hr className="my-1 border-border" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  aria-label="Centralizar mapa"
                >
                  <Locate className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Layer Controls */}
        <div className="absolute right-4 top-4 z-10">
          <Card className="border-border/50 bg-card/95 backdrop-blur">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4" />
                Camadas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                <button
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
                  onClick={() => setShowSensors(!showSensors)}
                >
                  <span className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary" />
                    Sensores
                  </span>
                  {showSensors ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-destructive" />
                    Mapa de Calor
                  </span>
                  {showHeatmap ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulated Map Content */}
        <div 
          className="relative h-full w-full bg-gradient-to-br from-primary/5 via-secondary/30 to-accent/5"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.5
          }} />

          {/* Zone Outlines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Zona Norte */}
            <path
              d="M10,10 L50,10 L50,45 L10,45 Z"
              fill={selectedZone === 1 ? "hsl(var(--primary) / 0.2)" : "hsl(var(--primary) / 0.05)"}
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
              className="cursor-pointer transition-colors"
              onClick={() => setSelectedZone(selectedZone === 1 ? null : 1)}
            />
            {/* Zona Sul */}
            <path
              d="M50,10 L90,10 L90,45 L50,45 Z"
              fill={selectedZone === 2 ? "hsl(var(--success) / 0.2)" : "hsl(var(--success) / 0.05)"}
              stroke="hsl(var(--success))"
              strokeWidth="0.3"
              className="cursor-pointer transition-colors"
              onClick={() => setSelectedZone(selectedZone === 2 ? null : 2)}
            />
            {/* Zona Leste */}
            <path
              d="M10,45 L50,45 L50,90 L10,90 Z"
              fill={selectedZone === 3 ? "hsl(var(--warning) / 0.2)" : "hsl(var(--warning) / 0.05)"}
              stroke="hsl(var(--warning))"
              strokeWidth="0.3"
              className="cursor-pointer transition-colors"
              onClick={() => setSelectedZone(selectedZone === 3 ? null : 3)}
            />
            {/* Zona Oeste */}
            <path
              d="M50,45 L90,45 L90,90 L50,90 Z"
              fill={selectedZone === 4 ? "hsl(var(--success) / 0.2)" : "hsl(var(--success) / 0.05)"}
              stroke="hsl(var(--success))"
              strokeWidth="0.3"
              className="cursor-pointer transition-colors"
              onClick={() => setSelectedZone(selectedZone === 4 ? null : 4)}
            />
          </svg>

          {/* Heat Points */}
          {showHeatmap && heatPoints.map((point, index) => (
            <div
              key={point.id}
              className="absolute"
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`,
              }}
            >
              <div
                className={`h-16 w-16 rounded-full blur-xl ${
                  point.intensity === "high"
                    ? "bg-destructive/60"
                    : point.intensity === "medium"
                    ? "bg-warning/60"
                    : "bg-accent/60"
                }`}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Flame
                  className={`h-6 w-6 ${
                    point.intensity === "high"
                      ? "text-destructive"
                      : point.intensity === "medium"
                      ? "text-warning"
                      : "text-accent"
                  }`}
                />
              </div>
            </div>
          ))}

          {/* Sensors */}
          {showSensors && sensors.map((sensor, index) => (
            <div
              key={sensor.id}
              className="absolute"
              style={{
                left: `${15 + index * 18}%`,
                top: `${25 + (index % 3) * 20}%`,
              }}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  sensor.status === "online"
                    ? "border-primary bg-primary/20"
                    : sensor.status === "warning"
                    ? "border-warning bg-warning/20"
                    : "border-muted bg-muted/20"
                }`}
                title={`${sensor.name} - ${sensor.temp}°C`}
              >
                <Radio
                  className={`h-4 w-4 ${
                    sensor.status === "online"
                      ? "text-primary"
                      : sensor.status === "warning"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>
          ))}

          {/* Zone Labels */}
          <div className="absolute left-[20%] top-[20%] text-sm font-medium text-foreground/70">
            Zona Norte
          </div>
          <div className="absolute right-[25%] top-[20%] text-sm font-medium text-foreground/70">
            Zona Sul
          </div>
          <div className="absolute bottom-[25%] left-[20%] text-sm font-medium text-foreground/70">
            Zona Leste
          </div>
          <div className="absolute bottom-[25%] right-[25%] text-sm font-medium text-foreground/70">
            Zona Oeste
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="border-border/50 bg-card/95 backdrop-blur">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Legenda</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span>Risco Alto</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span>Risco Médio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 shrink-0 space-y-4">
        {/* Zones List */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Zonas de Monitoramento</CardTitle>
            <CardDescription>Selecione uma zona para detalhes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {zones.map((zone) => (
              <button
                key={zone.id}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  selectedZone === zone.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:bg-secondary/50"
                }`}
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
              >
                <div>
                  <p className="font-medium text-foreground">{zone.name}</p>
                  <p className="text-xs text-muted-foreground">{zone.sensors} sensores ativos</p>
                </div>
                {zone.status === "warning" ? (
                  <Badge variant="secondary" className="bg-warning/10 text-warning">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {zone.alerts}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Normal
                  </Badge>
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Selected Zone Details */}
        {selectedZone && (
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {zones.find((z) => z.id === selectedZone)?.name}
              </CardTitle>
              <CardDescription>Informações detalhadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Radio className="h-4 w-4" />
                  Sensores
                </span>
                <span className="font-medium text-foreground">
                  {zones.find((z) => z.id === selectedZone)?.sensors}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  Temp. Média
                </span>
                <span className="font-medium text-foreground">28°C</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Alertas
                </span>
                <span className="font-medium text-foreground">
                  {zones.find((z) => z.id === selectedZone)?.alerts}
                </span>
              </div>
              <Button className="w-full" variant="outline">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Active Alerts in Map */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-destructive" />
              Pontos de Calor Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {heatPoints.map((point) => (
              <div
                key={point.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{point.area}</p>
                  <p className="text-xs text-muted-foreground">
                    Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    point.intensity === "high"
                      ? "bg-destructive/10 text-destructive"
                      : point.intensity === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-accent/10 text-accent-foreground"
                  }
                >
                  {point.intensity === "high" ? "Alto" : point.intensity === "medium" ? "Médio" : "Baixo"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
