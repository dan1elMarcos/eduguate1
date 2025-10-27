import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Plus } from "lucide-react"

export default async function StudentTutoringPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "student") {
    redirect("/auth/complete-profile")
  }

  // Get tutoring requests by status
  const { data: pendingRequests } = await supabase
    .from("tutoring_requests")
    .select("*")
    .eq("student_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  const { data: acceptedRequests } = await supabase
    .from("tutoring_requests")
    .select("*, profiles!tutoring_requests_tutor_id_fkey(*)")
    .eq("student_id", user.id)
    .eq("status", "accepted")
    .order("scheduled_date", { ascending: true })

  const { data: completedRequests } = await supabase
    .from("tutoring_requests")
    .select("*, profiles!tutoring_requests_tutor_id_fkey(*)")
    .eq("student_id", user.id)
    .eq("status", "completed")
    .order("updated_at", { ascending: false })

  const statusColors = {
    pending: "bg-yellow-500",
    accepted: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  }

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Tutorías</h1>
            <p className="text-muted-foreground">Solicita ayuda y gestiona tus sesiones de tutoría</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/student/tutoring/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Solicitud
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="accepted" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accepted">Programadas ({acceptedRequests?.length || 0})</TabsTrigger>
            <TabsTrigger value="pending">Pendientes ({pendingRequests?.length || 0})</TabsTrigger>
            <TabsTrigger value="completed">Completadas ({completedRequests?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedRequests && acceptedRequests.length > 0 ? (
              acceptedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.subject}</CardTitle>
                        <CardDescription>Tutor: {request.profiles?.full_name || "Por asignar"}</CardDescription>
                      </div>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Descripción:</h4>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    {request.scheduled_date && (
                      <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Fecha Programada:</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.scheduled_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No tienes tutorías programadas</p>
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <Link href="/dashboard/student/tutoring/new">Solicitar Tutoría</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests && pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.subject}</CardTitle>
                        <CardDescription>Esperando que un tutor acepte</CardDescription>
                      </div>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Descripción:</h4>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Solicitado: {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No tienes solicitudes pendientes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRequests && completedRequests.length > 0 ? (
              completedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.subject}</CardTitle>
                        <CardDescription>Tutor: {request.profiles?.full_name || "No asignado"}</CardDescription>
                      </div>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Descripción:</h4>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completada: {new Date(request.updated_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No tienes tutorías completadas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
