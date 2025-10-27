import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Users, Calendar, CheckCircle } from "lucide-react"

export default async function TutorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "tutor") {
    redirect("/auth/complete-profile")
  }

  // Get pending tutoring requests
  const { data: pendingRequests } = await supabase
    .from("tutoring_requests")
    .select("*, profiles!tutoring_requests_student_id_fkey(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get accepted tutoring requests
  const { data: acceptedRequests } = await supabase
    .from("tutoring_requests")
    .select("*")
    .eq("tutor_id", user.id)
    .eq("status", "accepted")
    .order("scheduled_date", { ascending: true })

  // Get content created by tutor
  const { count: contentCount } = await supabase
    .from("educational_content")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)

  // Get completed sessions
  const { count: completedCount } = await supabase
    .from("tutoring_requests")
    .select("*", { count: "exact", head: true })
    .eq("tutor_id", user.id)
    .eq("status", "completed")

  return (
    <DashboardLayout role="tutor" userName={profile.full_name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Tutor</h1>
          <p className="text-muted-foreground">Gestiona tus tutorías y contenidos educativos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Esperando respuesta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tutorías Activas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedRequests?.length || 0}</div>
              <p className="text-xs text-muted-foreground">En progreso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contenidos Creados</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total publicados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>Estudiantes que necesitan tu ayuda</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests && pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{request.profiles?.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {request.subject} - {request.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Solicitado: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/tutor/requests/${request.id}`}>Ver Detalles</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard/tutor/requests">Ver Todas las Solicitudes</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay solicitudes pendientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Sesiones</CardTitle>
            <CardDescription>Tutorías programadas</CardDescription>
          </CardHeader>
          <CardContent>
            {acceptedRequests && acceptedRequests.length > 0 ? (
              <div className="space-y-4">
                {acceptedRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{request.subject}</h3>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      {request.scheduled_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Fecha: {new Date(request.scheduled_date).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" asChild className="bg-transparent">
                      <Link href={`/dashboard/tutor/requests/${request.id}`}>Ver</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay sesiones programadas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Crear Contenido</CardTitle>
              <CardDescription>Comparte material educativo con los estudiantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/dashboard/tutor/content/new">Crear Nuevo Contenido</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crear Evaluación</CardTitle>
              <CardDescription>Diseña evaluaciones para medir el progreso</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/dashboard/tutor/evaluations/new">Crear Nueva Evaluación</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
