import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ subject: string; id: string }>
}) {
  const { subject, id } = await params
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

  // Get content details
  const { data: content } = await supabase.from("educational_content").select("*").eq("id", id).single()

  if (!content) {
    redirect(`/dashboard/student/subjects/${subject}`)
  }

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/student/subjects/${subject}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
            <p className="text-muted-foreground">
              {content.subject} - {content.education_level}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{content.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{content.content}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href={`/dashboard/student/subjects/${subject}`}>Volver a {content.subject}</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/dashboard/student/evaluations">Hacer Evaluación</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
