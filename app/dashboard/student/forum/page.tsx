import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Plus } from "lucide-react"

export default async function StudentForumPage() {
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

  // Get recent forum posts
  const { data: posts } = await supabase
    .from("forum_posts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Foro Comunitario</h1>
            <p className="text-muted-foreground">Comparte dudas y aprende con otros estudiantes</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/student/forum/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Publicación
            </Link>
          </Button>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {post.title}
                      </CardTitle>
                      <CardDescription>
                        Por {post.profiles?.full_name} - {new Date(post.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {post.subject && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {post.subject}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <Link href={`/dashboard/student/forum/${post.id}`}>Ver Discusión</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No hay publicaciones aún</h3>
              <p className="mb-4 text-muted-foreground">Sé el primero en iniciar una discusión</p>
              <Button asChild>
                <Link href="/dashboard/student/forum/new">Crear Publicación</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
