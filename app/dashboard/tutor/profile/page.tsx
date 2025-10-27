import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, BookOpen } from "lucide-react"

export default async function TutorProfilePage() {
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

  // Get statistics
  const { count: contentCount } = await supabase
    .from("educational_content")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)

  const { count: evaluationCount } = await supabase
    .from("evaluations")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)

  const { count: completedSessions } = await supabase
    .from("tutoring_requests")
    .select("*", { count: "exact", head: true })
    .eq("tutor_id", user.id)
    .eq("status", "completed")

  return (
    <DashboardLayout role="tutor" userName={profile.full_name}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Información de tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Tus datos de tutor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Nombre Completo</p>
                <p className="text-sm text-muted-foreground">{profile.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Correo Electrónico</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {profile.age && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Edad</p>
                  <p className="text-sm text-muted-foreground">{profile.age} años</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Rol</p>
                <p className="text-sm text-muted-foreground">Tutor Voluntario</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Contribución</CardTitle>
            <CardDescription>Tu impacto en la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Contenidos Creados</p>
                <p className="text-xs text-muted-foreground">Material educativo publicado</p>
              </div>
              <div className="text-3xl font-bold text-primary">{contentCount || 0}</div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Evaluaciones Creadas</p>
                <p className="text-xs text-muted-foreground">Pruebas diseñadas</p>
              </div>
              <div className="text-3xl font-bold text-secondary">{evaluationCount || 0}</div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Sesiones Completadas</p>
                <p className="text-xs text-muted-foreground">Estudiantes ayudados</p>
              </div>
              <div className="text-3xl font-bold text-accent">{completedSessions || 0}</div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Miembro Desde</p>
                <p className="text-xs text-muted-foreground">Fecha de registro</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
