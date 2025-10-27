import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default async function EvaluationsPage() {
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

  // Get available evaluations
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*")
    .eq("education_level", profile.education_level || "primaria")
    .order("created_at", { ascending: false })

  // Get student's completed evaluations
  const { data: completedEvaluations } = await supabase
    .from("evaluation_results")
    .select("evaluation_id")
    .eq("student_id", user.id)

  const completedIds = new Set(completedEvaluations?.map((e) => e.evaluation_id) || [])

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Evaluaciones</h1>
          <p className="text-muted-foreground">Pon a prueba tus conocimientos</p>
        </div>

        {evaluations && evaluations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {evaluations.map((evaluation) => {
              const isCompleted = completedIds.has(evaluation.id)

              return (
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
                      <span className="text-muted-foreground">Preguntas:</span>
                      <span className="font-medium text-foreground">{evaluation.questions.length}</span>
                    </div>
                    {isCompleted && (
                      <div className="rounded-md bg-primary/10 p-2 text-center text-sm font-medium text-primary">
                        Completada
                      </div>
                    )}
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/student/evaluations/${evaluation.id}`}>
                        {isCompleted ? "Ver Resultados" : "Comenzar"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No hay evaluaciones disponibles</h3>
              <p className="text-muted-foreground">Pronto habrá nuevas evaluaciones</p>
              <Button variant="outline" className="mt-4 bg-transparent" asChild>
                <Link href="/dashboard/student/subjects">Volver a Materias</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
