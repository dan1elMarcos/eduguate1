import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"

export default async function SubjectContentPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
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

  // Get content for this subject
  const { data: contents } = await supabase
    .from("educational_content")
    .select("*")
    .eq("subject", subject)
    .eq("education_level", profile.education_level || "primaria")
    .order("created_at", { ascending: false })

  const subjectNames: Record<string, string> = {
    matematicas: "Matemáticas",
    lenguaje: "Lenguaje",
    ciencias: "Ciencias",
    sociales: "Ciencias Sociales",
    ingles: "Inglés",
  }

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/student/subjects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{subjectNames[subject] || subject}</h1>
            <p className="text-muted-foreground">Contenidos de {profile.education_level}</p>
          </div>
        </div>

        {contents && contents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {contents.map((content) => (
              <Card key={content.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {content.title}
                  </CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/student/subjects/${subject}/${content.id}`}>Estudiar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No hay contenidos disponibles</h3>
              <p className="text-muted-foreground">Pronto habrá nuevos materiales de estudio</p>
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
