"use client"

import { use, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import type { TutoringRequest, Profile } from "@/lib/types"

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [request, setRequest] = useState<(TutoringRequest & { profiles?: Profile }) | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [scheduledDate, setScheduledDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!profileData || profileData.role !== "tutor") {
        router.push("/auth/complete-profile")
        return
      }

      setProfile(profileData)

      const { data: requestData } = await supabase
        .from("tutoring_requests")
        .select("*, profiles!tutoring_requests_student_id_fkey(*)")
        .eq("id", id)
        .single()

      if (requestData) {
        setRequest(requestData as TutoringRequest & { profiles?: Profile })
        if (requestData.scheduled_date) {
          setScheduledDate(new Date(requestData.scheduled_date).toISOString().slice(0, 16))
        }
      }
    }

    fetchData()
  }, [id, router, supabase])

  const handleAccept = async () => {
    if (!profile || !scheduledDate) {
      setError("Por favor selecciona una fecha y hora")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("tutoring_requests")
        .update({
          tutor_id: profile.id,
          status: "accepted",
          scheduled_date: scheduledDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push("/dashboard/tutor/requests")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aceptar la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("tutoring_requests")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push("/dashboard/tutor/requests")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al completar la tutoría")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("tutoring_requests")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push("/dashboard/tutor/requests")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cancelar la tutoría")
    } finally {
      setIsLoading(false)
    }
  }

  if (!request || !profile) {
    return (
      <DashboardLayout role="tutor">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </DashboardLayout>
    )
  }

  const statusColors = {
    pending: "bg-yellow-500",
    accepted: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  }

  return (
    <DashboardLayout role="tutor" userName={profile.full_name}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tutor/requests">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Detalles de Solicitud</h1>
            <p className="text-muted-foreground">Gestiona esta solicitud de tutoría</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Información del Estudiante</CardTitle>
                <CardDescription>Datos del solicitante</CardDescription>
              </div>
              <Badge className={statusColors[request.status as keyof typeof statusColors]}>{request.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Nombre:</h4>
                <p className="text-sm text-muted-foreground">{request.profiles?.full_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Nivel Educativo:</h4>
                <p className="text-sm text-muted-foreground">{request.profiles?.education_level}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Edad:</h4>
                <p className="text-sm text-muted-foreground">{request.profiles?.age || "No especificada"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Correo:</h4>
                <p className="text-sm text-muted-foreground">{request.profiles?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Solicitud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Materia:</h4>
              <p className="text-sm text-muted-foreground">{request.subject}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Descripción:</h4>
              <p className="text-sm text-muted-foreground">{request.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Fecha de Solicitud:</h4>
              <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleString()}</p>
            </div>
            {request.scheduled_date && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Fecha Programada:</h4>
                <p className="text-sm text-muted-foreground">{new Date(request.scheduled_date).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {request.status === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Aceptar Solicitud</CardTitle>
              <CardDescription>Programa una fecha para la tutoría</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduledDate">Fecha y Hora</Label>
                <div className="flex gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div className="flex gap-4">
                <Button onClick={handleAccept} disabled={isLoading} className="flex-1">
                  {isLoading ? "Procesando..." : "Aceptar Solicitud"}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={isLoading} className="flex-1 bg-transparent">
                  Rechazar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {request.status === "accepted" && (
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
              <CardDescription>Gestiona el estado de la tutoría</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div className="flex gap-4">
                <Button onClick={handleComplete} disabled={isLoading} className="flex-1">
                  {isLoading ? "Procesando..." : "Marcar como Completada"}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={isLoading} className="flex-1 bg-transparent">
                  Cancelar Tutoría
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
