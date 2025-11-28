"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
  XIcon,
} from "lucide-react"
import { getAnalyticsStats, cleanOldAnalytics } from "@/hooks/use-analytics"

interface AnalyticsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const ADMIN_PASSWORD = "admin123" // Você pode mudar essa senha

export function AnalyticsPanel({ isOpen, onClose }: AnalyticsPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [stats, setStats] = useState(getAnalyticsStats())

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      // Atualizar stats quando o painel é aberto
      setStats(getAnalyticsStats())
      
      // Limpar dados antigos
      cleanOldAnalytics()
    }
  }, [isOpen, isAuthenticated])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
      setPassword("")
    } else {
      setError("Senha incorreta")
    }
  }

  const handleClose = () => {
    setIsAuthenticated(false)
    setPassword("")
    setError("")
    onClose()
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

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {!isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle>Acesso ao Painel de Analytics</DialogTitle>
              <DialogDescription>
                Digite a senha de administrador para acessar as estatísticas de acesso.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Digite a senha"
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleLogin}>Acessar</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Painel de Analytics</span>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>
                Estatísticas de acesso à aplicação (armazenadas localmente no navegador)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Cards de Estatísticas Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total de Acessos</p>
                        <p className="text-2xl font-bold">{stats.totalVisits}</p>
                      </div>
                      <EyeIcon className="h-8 w-8 text-primary opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Visitantes Únicos</p>
                        <p className="text-2xl font-bold">{stats.uniqueVisitors}</p>
                      </div>
                      <UsersIcon className="h-8 w-8 text-blue-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Acessos Hoje</p>
                        <p className="text-2xl font-bold">{stats.visitsToday}</p>
                      </div>
                      <TrendingUpIcon className="h-8 w-8 text-green-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Tempo Médio</p>
                        <p className="text-2xl font-bold">
                          {formatDuration(stats.avgSessionDuration)}
                        </p>
                      </div>
                      <ClockIcon className="h-8 w-8 text-orange-500 opacity-50" />
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
                  <CardTitle className="text-base">Acessos nos Últimos 30 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
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
                        dot={{ fill: "#8b5cf6", r: 3 }}
                        name="Acessos"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Últimos Acessos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Últimos 10 Acessos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.recentVisits.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum acesso registrado ainda
                      </p>
                    ) : (
                      stats.recentVisits.map((visit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <div>
                              <p className="text-sm font-medium">{formatDate(visit.timestamp)}</p>
                              <p className="text-xs text-muted-foreground">
                                Dispositivo: {visit.deviceId.substring(0, 20)}...
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

              {/* Informações Adicionais */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota:</strong> Todos os dados são armazenados localmente no navegador usando
                    localStorage. Nenhum dado é enviado para servidores externos. Os dados são mantidos
                    por 90 dias e então removidos automaticamente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
