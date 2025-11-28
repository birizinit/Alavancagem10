"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUpIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  ActivityIcon,
  LockIcon,
  LogOutIcon,
} from "lucide-react"
import { getAnalyticsStats, cleanOldAnalytics } from "@/hooks/use-analytics"

const ADMIN_USER = "patrick_admin"
const ADMIN_PASSWORD = "admin"

export default function AdminStatusPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [stats, setStats] = useState(getAnalyticsStats())

  useEffect(() => {
    if (isAuthenticated) {
      // Atualizar stats quando autenticado
      setStats(getAnalyticsStats())
      cleanOldAnalytics()

      // Atualizar a cada 30 segundos
      const interval = setInterval(() => {
        setStats(getAnalyticsStats())
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
      setUsername("")
      setPassword("")
    } else {
      setError("Usuário ou senha incorretos")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
    setError("")
  }

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <LockIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Painel de Administração</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Acesso restrito - Analytics do Sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite o usuário"
                  className={error ? "border-red-500" : ""}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className={error ? "border-red-500" : ""}
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full">
                Acessar Painel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ActivityIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">Painel de Analytics</h1>
                <p className="text-xs text-muted-foreground">Admin: {ADMIN_USER}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Acessos</p>
                  <p className="text-3xl font-bold">{stats.totalVisits}</p>
                </div>
                <EyeIcon className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Visitantes Únicos</p>
                  <p className="text-3xl font-bold">{stats.uniqueVisitors}</p>
                </div>
                <UsersIcon className="h-10 w-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Acessos Hoje</p>
                  <p className="text-3xl font-bold">{stats.visitsToday}</p>
                </div>
                <TrendingUpIcon className="h-10 w-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tempo Médio</p>
                  <p className="text-3xl font-bold">
                    {formatDuration(stats.avgSessionDuration)}
                  </p>
                </div>
                <ClockIcon className="h-10 w-10 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Períodos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.visitsThisWeek}</p>
              <p className="text-xs text-muted-foreground mt-1">acessos nos últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Este Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.visitsThisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">acessos nos últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ActivityIcon className="h-4 w-4" />
                Último Acesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {stats.lastVisit ? formatDate(stats.lastVisit) : "Nenhum acesso"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Acessos por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Acessos nos Últimos 30 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.visitsByDay}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={4}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.8)", 
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px"
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  name="Acessos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Últimos Acessos */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos 10 Acessos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentVisits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum acesso registrado ainda</p>
                </div>
              ) : (
                stats.recentVisits.map((visit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium">{formatDate(visit.timestamp)}</p>
                        <p className="text-xs text-muted-foreground">
                          Dispositivo: {visit.deviceId.substring(0, 25)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {visit.sessionDuration > 0 
                          ? formatDuration(visit.sessionDuration) 
                          : "Em sessão"}
                      </p>
                      <p className="text-xs text-muted-foreground">{visit.page}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ActivityIcon className="h-4 w-4" />
                Informações do Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p><strong>Armazenamento:</strong> localStorage (navegador)</p>
                  <p><strong>Retenção:</strong> 90 dias automático</p>
                </div>
                <div>
                  <p><strong>Limite:</strong> 1000 acessos mais recentes</p>
                  <p><strong>Privacidade:</strong> 100% local, sem envio externo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
