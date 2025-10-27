import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function TutoringRequestsPage() {
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

  // Get all requests by status
  const { data: pendingRequests } = await supabase
    .from("tutoring_requests")
    .select("*, profiles!tutoring_requests_student_id_fkey(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  const { data: acceptedRequests } = await supabase
    .from("tutoring_requests")
    .select("*, profiles!tutoring_requests_student_id_fkey(*)")
    .eq("tutor_id", user.id)
    .eq("status", "accepted")
    .order("scheduled_date", { ascending: true })

  const { data: completedRequests } = await supabase
    .from("tutoring_requests")
    .select("*, profiles!tutoring_requests_student_id_fkey(*)")
    .eq("tutor_id", user.id)
    .eq("status", "completed")
    .order("updated_at", { ascending: false })

  const statusColors = {
    pending: "bg-yellow-500",
    accepted: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  }

  return (
    <DashboardLayout role="tutor" userName={profile.full_name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Solicitudes de Tutoría</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de ayuda de los estudiantes</p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pendientes ({pendingRequests?.length || 0})</TabsTrigger>
            <TabsTrigger value="accepted">Aceptadas ({acceptedRequests?.length || 0})</TabsTrigger>
            <TabsTrigger value="completed">Completadas ({completedRequests?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests && pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.profiles?.full_name}</CardTitle>
                        <CardDescription>
                          {request.profiles?.education_level} - {request.subject}
                        </CardDescription>
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
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/tutor/requests/${request.id}`}>Ver y Responder</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No hay solicitudes pendientes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedRequests && acceptedRequests.length > 0 ? (
              acceptedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.profiles?.full_name}</CardTitle>
                        <CardDescription>
                          {request.profiles?.education_level} - {request.subject}
                        </CardDescription>
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
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Fecha Programada:</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.scheduled_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/tutor/requests/${request.id}`}>Ver Detalles</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No hay tutorías aceptadas</p>
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
                        <CardTitle>{request.profiles?.full_name}</CardTitle>
                        <CardDescription>
                          {request.profiles?.education_level} - {request.subject}
                        </CardDescription>
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
                  <p className="text-muted-foreground">No hay tutorías completadas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
