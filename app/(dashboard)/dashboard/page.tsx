"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Flame, Map as MapIcon, AlertTriangle } from "lucide-react";

// Importa o mapa dinamicamente para evitar erro de SSR (Server-Side Rendering)
const MapView = dynamic(() => import("@/components/dashboard/map-view"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">Carregando mapa...</div>
});

const API_BASE_URL = "https://3qigbzusxi.execute-api.sa-east-1.amazonaws.com"; // Substitua pela sua URL
export default function DashboardPage() {
  const [dadosInfo, setDadosInfo] = useState<any>(null);
  const [dadosMapa, setDadosMapa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Faz chamadas simultâneas para os dois endpoints
        const [resInfo, resMapa] = await Promise.all([
          fetch(`${API_BASE_URL}/focos-diarios-info`),
          fetch(`${API_BASE_URL}/mapa`) // ou a rota correta do mapa
        ]);

        const info = await resInfo.json();
        const mapa = await resMapa.json();

        // Transforma objetos em arrays para o Recharts (BarChart)
        const biomasArray = Object.entries(info.biomasAfetados || {}).map(([name, value]) => ({ name, value }));
        const estadosArray = Object.entries(info.estadosAfetados || {})
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 10); // Pega o Top 10 estados

        setDadosInfo({ ...info, biomasArray, estadosArray });
        setDadosMapa(mapa);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 flex items-center justify-center h-full">Carregando dados do Firewatch...</div>;
  }

  if (!dadosInfo) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral dos Focos</h2>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Focos (24h)</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosInfo.totalFocos}</div>
            <p className="text-xs text-muted-foreground">Focos consolidados pelo INPE</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Principal Bioma Afetado</CardTitle>
            <MapIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosInfo.biomasArray.sort((a:any, b:any) => b.value - a.value)[0]?.name || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado mais Afetado</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosInfo.estadosArray[0]?.name || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Mapa */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Gráfico Temporal */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Evolução por Hora</CardTitle>
            <CardDescription>Quantidade de focos detectados nas últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosInfo.graficoHora}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="key" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="value" name="Focos" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Biomas */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Focos por Bioma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosInfo.biomasArray} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                  <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                  <Bar dataKey="value" name="Focos" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mapa Integrado */}
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Mapa de Focos de Calor</CardTitle>
            <CardDescription>Distribuição geoespacial baseada na gravidade (Risco de Fogo)</CardDescription>
          </CardHeader>
          <CardContent>
            <MapView focos={dadosMapa} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}