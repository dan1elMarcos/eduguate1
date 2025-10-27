"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { SubjectType, EducationLevel } from "@/lib/types"
import { useEffect } from "react"

export default function NewContentPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    subject: "" as SubjectType,
    educationLevel: "" as EducationLevel,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!profile || profile.role !== "tutor") {
        router.push("/auth/complete-profile")
        return
      }

      setUserId(user.id)
      setUserName(profile.full_name)
    }

    checkUser()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.subject || !formData.educationLevel) {
      setError("Por favor completa todos los campos requeridos")
      setIsLoading(false)
      return
    }

    if (!userId) {
      setError("Error: Usuario no encontrado")
      setIsLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from("educational_content").insert({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        subject: formData.subject,
        education_level: formData.educationLevel,
        created_by: userId,
      })

      if (insertError) throw insertError

      router.push("/dashboard/tutor/content")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear el contenido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="tutor" userName={userName}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tutor/content">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crear Contenido Educativo</h1>
            <p className="text-muted-foreground">Comparte tu conocimiento con los estudiantes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Contenido</CardTitle>
            <CardDescription>Completa los detalles del material educativo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ej: Suma y Resta Básica"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descripción del contenido"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Materia</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value: SubjectType) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematicas">Matemáticas</SelectItem>
                      <SelectItem value="lenguaje">Lenguaje</SelectItem>
                      <SelectItem value="ciencias">Ciencias</SelectItem>
                      <SelectItem value="sociales">Ciencias Sociales</SelectItem>
                      <SelectItem value="ingles">Inglés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="educationLevel">Nivel Educativo</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(value: EducationLevel) => setFormData({ ...formData, educationLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaria">Primaria</SelectItem>
                      <SelectItem value="basicos">Básicos</SelectItem>
                      <SelectItem value="diversificado">Diversificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    placeholder="Escribe el contenido educativo completo aquí..."
                    rows={12}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Escribe el contenido de forma clara y detallada para que los estudiantes puedan aprender fácilmente.
                  </p>
                </div>

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/dashboard/tutor/content">Cancelar</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Contenido"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
