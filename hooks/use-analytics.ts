"use client"

import { useEffect, useRef } from "react"
import { safeGetItem, safeSetItem } from "@/lib/storage"

interface AnalyticsData {
  deviceId: string
  visits: Visit[]
  totalVisits: number
  uniqueVisitors: Set<string>
}

interface Visit {
  timestamp: number
  deviceId: string
  sessionDuration: number
  page: string
}

interface AnalyticsStats {
  totalVisits: number
  uniqueVisitors: number
  lastVisit: number | null
  avgSessionDuration: number
  visitsToday: number
  visitsThisWeek: number
  visitsThisMonth: number
  visitsByDay: { date: string; count: number }[]
  recentVisits: Visit[]
}

const STORAGE_KEY = "app_analytics_data"
const DEVICE_ID_KEY = "app_device_id"

// Gerar ID único para o dispositivo
function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Obter ou criar ID do dispositivo
function getDeviceId(): string {
  if (typeof window === "undefined") return ""

  const storedId = safeGetItem("local", DEVICE_ID_KEY)
  if (storedId) {
    return storedId
  }

  const deviceId = generateDeviceId()
  safeSetItem("local", DEVICE_ID_KEY, deviceId)
  return deviceId
}

// Obter dados de analytics do localStorage
function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return {
      deviceId: "",
      visits: [],
      totalVisits: 0,
      uniqueVisitors: new Set(),
    }
  }

  try {
    const stored = safeGetItem("local", STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        uniqueVisitors: new Set(parsed.uniqueVisitors || []),
      }
    }
  } catch (error) {
    console.error("Erro ao carregar analytics:", error)
  }

  return {
    deviceId: getDeviceId(),
    visits: [],
    totalVisits: 0,
    uniqueVisitors: new Set(),
  }
}

// Salvar dados de analytics no localStorage
function saveAnalyticsData(data: AnalyticsData): void {
  if (typeof window === "undefined") return

  try {
    const toSave = {
      ...data,
      uniqueVisitors: Array.from(data.uniqueVisitors),
    }
    safeSetItem("local", STORAGE_KEY, JSON.stringify(toSave))
  } catch (error) {
    console.error("Erro ao salvar analytics:", error)
  }
}

// Registrar uma nova visita
function recordVisit(page: string = "/"): void {
  const deviceId = getDeviceId()
  const data = getAnalyticsData()

  const visit: Visit = {
    timestamp: Date.now(),
    deviceId,
    sessionDuration: 0,
    page,
  }

  data.visits.push(visit)
  data.totalVisits += 1
  data.uniqueVisitors.add(deviceId)

  // Manter apenas os últimos 1000 acessos para não sobrecarregar o localStorage
  if (data.visits.length > 1000) {
    data.visits = data.visits.slice(-1000)
  }

  saveAnalyticsData(data)
}

// Atualizar duração da sessão
function updateSessionDuration(startTime: number): void {
  const data = getAnalyticsData()
  const deviceId = getDeviceId()

  // Encontrar a última visita deste dispositivo
  const lastVisitIndex = data.visits.findIndex(
    (v) => v.deviceId === deviceId && v.timestamp === startTime
  )

  if (lastVisitIndex !== -1) {
    data.visits[lastVisitIndex].sessionDuration = Date.now() - startTime
    saveAnalyticsData(data)
  }
}

// Calcular estatísticas
export function getAnalyticsStats(): AnalyticsStats {
  const data = getAnalyticsData()
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  const oneWeekMs = 7 * oneDayMs
  const oneMonthMs = 30 * oneDayMs

  // Filtrar visitas por período
  const visitsToday = data.visits.filter((v) => now - v.timestamp < oneDayMs).length
  const visitsThisWeek = data.visits.filter((v) => now - v.timestamp < oneWeekMs).length
  const visitsThisMonth = data.visits.filter((v) => now - v.timestamp < oneMonthMs).length

  // Calcular duração média de sessão
  const sessionsWithDuration = data.visits.filter((v) => v.sessionDuration > 0)
  const avgSessionDuration =
    sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((sum, v) => sum + v.sessionDuration, 0) / sessionsWithDuration.length
      : 0

  // Agrupar visitas por dia (últimos 30 dias)
  const visitsByDay: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now - i * oneDayMs)
    const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime()
    const dayEnd = dayStart + oneDayMs

    const count = data.visits.filter((v) => v.timestamp >= dayStart && v.timestamp < dayEnd).length
    visitsByDay.push({ date: dateStr, count })
  }

  // Últimas 10 visitas
  const recentVisits = [...data.visits].reverse().slice(0, 10)

  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueVisitors.size,
    lastVisit: data.visits.length > 0 ? data.visits[data.visits.length - 1].timestamp : null,
    avgSessionDuration,
    visitsToday,
    visitsThisWeek,
    visitsThisMonth,
    visitsByDay,
    recentVisits,
  }
}

// Hook para rastrear analytics automaticamente
export function useAnalytics(page: string = "/"): void {
  const sessionStartTime = useRef<number>(Date.now())
  const hasRecorded = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (hasRecorded.current) return

    // Registrar visita
    recordVisit(page)
    hasRecorded.current = true
    sessionStartTime.current = Date.now()

    // Atualizar duração da sessão a cada 30 segundos
    const interval = setInterval(() => {
      updateSessionDuration(sessionStartTime.current)
    }, 30000)

    // Atualizar duração ao sair da página
    const handleBeforeUnload = () => {
      updateSessionDuration(sessionStartTime.current)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      updateSessionDuration(sessionStartTime.current)
    }
  }, [page])
}

// Função para limpar dados antigos (manter apenas últimos 90 dias)
export function cleanOldAnalytics(): void {
  const data = getAnalyticsData()
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000

  data.visits = data.visits.filter((v) => v.timestamp > ninetyDaysAgo)
  saveAnalyticsData(data)
}
