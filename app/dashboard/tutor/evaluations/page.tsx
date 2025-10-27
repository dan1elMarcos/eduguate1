import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Plus } from "lucide-react"

export default async function TutorEvaluationsPage() {
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

  // Get evaluations created by this tutor
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout role="tutor" userName={profile.full_name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Evaluaciones</h1>
            <p className="text-muted-foreground">Gestiona las evaluaciones que has creado</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/tutor/evaluations/new">
              <Plus className="mr-2 h-4 w-4" />
              Crear Evaluación
            </Link>
          </Button>
        </div>

        {evaluations && evaluations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {evaluation.title}
                  </CardTitle>
                  <CardDescription>{evaluation.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Materia:</span>
                    <span className="font-medium text-foreground">{evaluation.subject}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nivel:</span>
                    <span className="font-medium text-foreground">{evaluation.education_level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Preguntas:</span>
                    <span className="font-medium text-foreground">{evaluation.questions.length}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Creada: {new Date(evaluation.created_at).toLocaleDateString()}
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/dashboard/tutor/evaluations/${evaluation.id}`}>Ver Detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No has creado evaluaciones aún</h3>
              <p className="mb-4 text-muted-foreground">Crea evaluaciones para medir el progreso de los estudiantes</p>
              <Button asChild>
                <Link href="/dashboard/tutor/evaluations/new">Crear Primera Evaluación</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
