"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context"; // <-- Importamos seu contexto de Auth

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Flame, Map as MapIcon, AlertTriangle, Clock, Satellite } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Importa o mapa dinamicamente
const MapView = dynamic(() => import("@/components/dashboard/map-view"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">Carregando mapa...</div>
});

const API_BASE_URL = "https://3qigbzusxi.execute-api.sa-east-1.amazonaws.com"; 

function formatTimestamp(unixTimestamp: number) {
  // Converte para milissegundos se necessário
  const timestampMs = unixTimestamp.toString().length === 13 
    ? unixTimestamp 
    : unixTimestamp * 1000;
  
  const date = new Date(timestampMs);
  
  // Formatação manual para garantir o formato correto
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function getRiscoFogoColor(risco: string) {
  const valor = parseFloat(risco);
  if (valor >= 0.8) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
  if (valor >= 0.6) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  if (valor >= 0.3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
}

function getRiscoFogoLabel(risco: string) {
  const valor = parseFloat(risco);
  if (valor >= 0.8) return "Crítico";
  if (valor >= 0.6) return "Alto";
  if (valor >= 0.3) return "Moderado";
  return "Baixo";
}


export default function DashboardPage() {
  const [dadosInfo, setDadosInfo] = useState<any>(null);
  const [dadosMapa, setDadosMapa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  // Pega as informações do seu contexto de autenticação
  const { isAuthenticated, isLoading: authLoading } = useAuth(); 

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const token = localStorage.getItem("token"); 

        const headers = {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json"
        };

        // Faz as requisições separadamente para não quebrar tudo se uma falhar
        const resInfo = await fetch(`${API_BASE_URL}/focos-diarios-info`, { headers });
        const resMapa = await fetch(`${API_BASE_URL}/mapa`, { headers });

        if (!resInfo.ok) {
           throw new Error(`Falha crítica na API Info. Status: ${resInfo.status}`);
        }

        // Processa os dados de Info (que sabemos que está retornando 200 OK)
        const info = await resInfo.json();
        
        const biomasArray = Object.entries(info.biomasAfetados || {}).map(([name, value]) => ({ name, value }));
        const estadosArray = Object.entries(info.estadosAfetados || {})
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 10);

        setDadosInfo({ ...info, biomasArray, estadosArray });

        // Tenta processar os dados do Mapa, mas se falhar, apenas avisa e deixa vazio
        if (resMapa.ok) {
            const mapa = await resMapa.json();
            setDadosMapa(mapa);
        } else {
            console.error(`A rota do Mapa falhou (Status: ${resMapa.status}). O gráfico do mapa ficará vazio por enquanto.`);
            setDadosMapa([]); // Deixa o mapa vazio para não quebrar a tela
        }

      } catch (error) {
        console.error("Erro no processamento do Dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated, authLoading, router]);

  if (loading || authLoading) {
    return <div className="p-8 flex items-center justify-center h-full">Carregando dados do Firewatch...</div>;
  }

  if (!dadosInfo) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral dos Focos</h2>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Focos (24h)</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosInfo.totalFocos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Focos (últimos 10min)</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosInfo.graficoHora[dadosInfo.graficoHora.length - 1]?.value || 0}</div>
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

       {/* Layout Principal: Mapa à Esquerda + Gráficos à Direita */}
      <div className="grid gap-4 lg:grid-cols-7">
        
        {/* Mapa - Lado Esquerdo */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Mapa de Focos de Calor</CardTitle>
            <CardDescription>Distribuição geoespacial baseada na gravidade (Risco de Fogo)</CardDescription>
          </CardHeader>
          <CardContent>
            <MapView focos={dadosMapa} />
          </CardContent>
        </Card>

        {/* Gráficos - Lado Direito */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Gráfico Temporal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução por Hora</CardTitle>
              <CardDescription>Quantidade de focos detectados na semana</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[150px]">
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
          <Card>
            <CardHeader>
              <CardTitle>Focos por Bioma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
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

        </div>
      </div>

      {/* Tabela de Focos Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Focos Recentes Detectados</CardTitle>
              <CardDescription>Últimos focos de calor identificados pelos satélites</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Container com altura máxima e scroll */}
          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    {/* <TableHead className="w-[180px]">
                      <div className="flex items-center gap-2">
                        Data/Hora
                      </div>
                    </TableHead> */}
                    <TableHead>Coordenadas</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Bioma</TableHead>
                    <TableHead className="text-right">FRP (MW)</TableHead>
                    <TableHead className="text-right">Risco de Fogo</TableHead>
                    <TableHead className="text-right">Satélite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosMapa.map((foco, index) => (
                    <TableRow key={index}>
                      {/* <TableCell className="font-medium">
                        {formatTimestamp(foco.data_hora_exp)}
                      </TableCell> */}
                      <TableCell>{foco.latitude.trim()}, {foco.longitude.trim()}</TableCell>
                      <TableCell>{foco.cidade}</TableCell>
                      <TableCell>{foco.estado}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                          {foco.bioma}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{foco.frp}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiscoFogoColor(foco.risc_fogo)}`}>
                          {getRiscoFogoLabel(foco.risc_fogo)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">
                          {(foco.satelite)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}