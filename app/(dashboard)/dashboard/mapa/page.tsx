"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { fetchFireData, fetchInpeStatistics } from "@/lib/fire-service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line 
} from "recharts"
import { MapPin, Info, BarChart3, Map as MapIcon } from "lucide-react"

// Componentes dinâmicos para o mapa (Leaflet)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

import "leaflet/dist/leaflet.css"

export default function MapaTaticoPage() {
  const [data, setData] = useState<any>(null)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Configurar ícones do Leaflet no cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet")
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
    }
  }, [])

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true)
        const [fireData, statsData] = await Promise.all([
          fetchFireData(),
          fetchInpeStatistics(),
        ])
        setData(fireData)
        setStats(Array.isArray(statsData) ? statsData.filter((s: any) => s.ano >= 2023) : [])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAllData()
  }, [])

  const focosInpe = useMemo(() => {
    const inpe = data?.inpe
    if (Array.isArray(inpe)) return inpe
    if (Array.isArray(inpe?.features)) return inpe.features
    return []
  }, [data])

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/4"/><Skeleton className="h-[500px] w-full"/></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoramento Amazônia</h1>
          <p className="text-muted-foreground">Dados táticos e estatísticos integrados do INPE e NASA FIRMS.</p>
        </div>
      </div>

      <Tabs defaultValue="mapa" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="mapa" className="gap-2">
            <MapIcon className="h-4 w-4" /> Mapa Tático
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Estatísticas
          </TabsTrigger>
        </TabsList>

        {/* ABA: MAPA TÁTICO */}
        <TabsContent value="mapa" className="space-y-6 mt-4">
          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-0">
              <div className="h-[500px] w-full">
                <MapContainer center={[-3.4653, -62.2159]} zoom={5} style={{ height: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {focosInpe.map((foco: any, i: number) => (
                    <Marker key={i} position={[foco.geometry.coordinates[1], foco.geometry.coordinates[0]]}>
                      <Popup>
                        <div className="text-xs">
                          <p><strong>Município:</strong> {foco.properties.municipio}</p>
                          <p><strong>Satélite:</strong> {foco.properties.satelite}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Atributos dos Focos (INPE)</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Município</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Data (GMT)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {focosInpe.length > 0 ? (
                    focosInpe.slice(0, 5).map((f: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{f.properties.municipio}</TableCell>
                        <TableCell>{f.properties.estado}</TableCell>
                        <TableCell>{new Date(f.properties.data_hora_gmt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Nenhum dado de foco encontrado para exibir.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: ESTATÍSTICAS COMPARATIVAS */}
        <TabsContent value="stats" className="space-y-6 mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Comparativo Mensal de Queimadas</CardTitle>
              <CardDescription>Dados históricos consolidados pelo INPE para o Bioma Amazônia.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {stats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                      />
                      <Legend />
                      <Bar dataKey="focos" fill="hsl(var(--destructive))" name="Focos Detectados" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="media" fill="hsl(var(--primary))" name="Média Histórica" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}