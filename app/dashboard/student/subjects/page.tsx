import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

const subjects = [
  { id: "matematicas", name: "Matemáticas", color: "bg-blue-500", description: "Aritmética, álgebra y geometría" },
  { id: "lenguaje", name: "Lenguaje", color: "bg-green-500", description: "Gramática y comprensión lectora" },
  { id: "ciencias", name: "Ciencias", color: "bg-purple-500", description: "Biología, química y física" },
  { id: "sociales", name: "Ciencias Sociales", color: "bg-orange-500", description: "Historia y geografía" },
  { id: "ingles", name: "Inglés", color: "bg-pink-500", description: "Vocabulario y gramática" },
]

export default async function SubjectsPage() {
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

  // Get content count for each subject
  const contentCounts: Record<string, number> = {}
  for (const subject of subjects) {
    const { count } = await supabase
      .from("educational_content")
      .select("*", { count: "exact", head: true })
      .eq("subject", subject.id)
      .eq("education_level", profile.education_level || "primaria")

    contentCounts[subject.id] = count || 0
  }

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materias</h1>
          <p className="text-muted-foreground">Explora contenidos educativos por área de conocimiento</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className={`mb-2 h-2 w-full rounded-full ${subject.color}`} />
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {subject.name}
                </CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {contentCounts[subject.id] || 0} contenidos disponibles
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/student/subjects/${subject.id}`}>Ver Contenidos</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
