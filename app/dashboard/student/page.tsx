import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, GraduationCap, Calendar, TrendingUp } from "lucide-react"

export default async function StudentDashboardPage() {
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

  // Get recent content
  const { data: recentContent } = await supabase
    .from("educational_content")
    .select("*")
    .eq("education_level", profile.education_level || "primaria")
    .order("created_at", { ascending: false })
    .limit(3)

  // Get student's evaluation results
  const { data: evaluationResults } = await supabase
    .from("evaluation_results")
    .select("*, evaluations(*)")
    .eq("student_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(3)

  // Get active tutoring requests
  const { data: tutoringRequests } = await supabase
    .from("tutoring_requests")
    .select("*")
    .eq("student_id", user.id)
    .in("status", ["pending", "accepted"])
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bienvenido, {profile.full_name}</h1>
          <p className="text-muted-foreground">Continúa tu aprendizaje donde lo dejaste</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contenidos Disponibles</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentContent?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Nuevos esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluaciones Completadas</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{evaluationResults?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tutorías Activas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tutoringRequests?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Solicitudes pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {evaluationResults && evaluationResults.length > 0
                  ? Math.round(
                      evaluationResults.reduce((acc, result) => acc + (result.score || 0), 0) /
                        evaluationResults.length,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Promedio general</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contenidos Recientes</CardTitle>
            <CardDescription>Nuevos materiales de estudio disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            {recentContent && recentContent.length > 0 ? (
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{content.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {content.subject} - {content.education_level}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/student/subjects/${content.subject}/${content.id}`}>Ver</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard/student/subjects">Ver Todas las Materias</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay contenidos disponibles aún</p>
                <Button variant="outline" className="mt-4 bg-transparent" asChild>
                  <Link href="/dashboard/student/subjects">Explorar Materias</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>Tus últimos resultados</CardDescription>
          </CardHeader>
          <CardContent>
            {evaluationResults && evaluationResults.length > 0 ? (
              <div className="space-y-4">
                {evaluationResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{result.evaluations?.title}</h3>
                      <p className="text-sm text-muted-foreground">{result.evaluations?.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{result.score}%</div>
                      <p className="text-xs text-muted-foreground">Calificación</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard/student/evaluations">Ver Todas las Evaluaciones</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No has completado evaluaciones aún</p>
                <Button variant="outline" className="mt-4 bg-transparent" asChild>
                  <Link href="/dashboard/student/evaluations">Comenzar Evaluación</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
