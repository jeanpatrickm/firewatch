"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Flame, 
  Shield, 
  MapPin, 
  Bell, 
  BarChart3, 
  Users,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Globe
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">FireWatch</span>
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#recursos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Recursos
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Como Funciona
            </Link>
            <Link href="#contato" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contato
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/login?tab=register">
              <Button size="sm">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Leaf className="h-4 w-4 text-primary" />
              <span>Protegendo nossas florestas com tecnologia</span>
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Monitoramento Inteligente de{" "}
              <span className="text-primary">Incêndios Florestais</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Sistema avançado de detecção precoce que combina sensores IoT, 
              inteligência artificial e dados meteorológicos para proteger 
              áreas de preservação ambiental.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login?tab=register">
                <Button size="lg" className="gap-2">
                  Solicitar Demonstração
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#recursos">
                <Button size="lg" variant="outline">
                  Conhecer Recursos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "98%", label: "Precisão na Detecção" },
              { value: "< 5min", label: "Tempo de Alerta" },
              { value: "500+", label: "Áreas Monitoradas" },
              { value: "24/7", label: "Monitoramento Ativo" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Recursos Avançados
            </h2>
            <p className="text-muted-foreground">
              Tecnologia de ponta para proteção ambiental eficiente
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Mapa Tático em Tempo Real",
                description: "Visualização geográfica completa com pontos de calor, sensores ativos e histórico de ocorrências.",
              },
              {
                icon: Bell,
                title: "Sistema de Alertas Inteligente",
                description: "Notificações instantâneas por SMS, e-mail e push com níveis de criticidade personalizáveis.",
              },
              {
                icon: BarChart3,
                title: "Dashboard Analítico",
                description: "Painéis interativos com métricas, tendências e relatórios detalhados de monitoramento.",
              },
              {
                icon: Shield,
                title: "Detecção por IA",
                description: "Algoritmos de machine learning que analisam padrões térmicos e identificam riscos antecipadamente.",
              },
              {
                icon: Users,
                title: "Gestão de Equipes",
                description: "Coordenação de brigadas de incêndio com comunicação integrada e rastreamento GPS.",
              },
              {
                icon: Globe,
                title: "Integração Meteorológica",
                description: "Dados climáticos em tempo real para previsão de risco e planejamento preventivo.",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="border-y border-border bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Como Funciona
            </h2>
            <p className="text-muted-foreground">
              Um processo simples e eficiente para proteger o meio ambiente
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Instalação de Sensores",
                description: "Dispositivos IoT são instalados estrategicamente nas áreas de monitoramento.",
              },
              {
                step: "02",
                title: "Coleta de Dados",
                description: "Sensores captam temperatura, umidade, gases e imagens térmicas continuamente.",
              },
              {
                step: "03",
                title: "Análise e Alertas",
                description: "IA processa os dados e emite alertas automáticos para a central e equipes de campo.",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                Pronto para proteger suas áreas florestais?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                Junte-se a centenas de organizações que já confiam no FireWatch 
                para monitoramento e prevenção de incêndios.
              </p>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                {[
                  "Implantação rápida",
                  "Suporte 24/7",
                  "Sem compromisso",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/login?tab=register">
                <Button size="lg" className="gap-2">
                  Começar Gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="border-t border-border bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Flame className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">FireWatch</span>
              </Link>
              <p className="max-w-sm text-sm text-muted-foreground">
                Sistema de monitoramento e detecção precoce de incêndios florestais, 
                protegendo o meio ambiente com tecnologia avançada.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#recursos" className="hover:text-foreground">Recursos</Link></li>
                <li><Link href="#como-funciona" className="hover:text-foreground">Como Funciona</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Acessar Sistema</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Contato</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contato@firewatch.com.br</li>
                <li>+55 (11) 99999-9999</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>2024 FireWatch. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
