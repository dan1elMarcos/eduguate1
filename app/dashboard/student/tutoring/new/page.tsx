"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { SubjectType } from "@/lib/types"

export default function NewTutoringRequestPage() {
  const [formData, setFormData] = useState({
    subject: "" as SubjectType,
    description: "",
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

      if (!profile || profile.role !== "student") {
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

    if (!formData.subject) {
      setError("Por favor selecciona una materia")
      setIsLoading(false)
      return
    }

    if (!userId) {
      setError("Error: Usuario no encontrado")
      setIsLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from("tutoring_requests").insert({
        student_id: userId,
        subject: formData.subject,
        description: formData.description,
        status: "pending",
      })

      if (insertError) throw insertError

      router.push("/dashboard/student/tutoring")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="student" userName={userName}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/student/tutoring">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Solicitar Tutoría</h1>
            <p className="text-muted-foreground">Pide ayuda a un tutor voluntario</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Solicitud</CardTitle>
            <CardDescription>Describe en qué necesitas ayuda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
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
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe qué tema necesitas repasar o qué dudas tienes..."
                    rows={6}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Sé específico sobre lo que necesitas aprender para que el tutor pueda prepararse mejor.
                  </p>
                </div>

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/dashboard/student/tutoring">Cancelar</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar Solicitud"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿Cómo funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Envía tu solicitud describiendo en qué necesitas ayuda</p>
            <p>2. Un tutor voluntario revisará tu solicitud y la aceptará</p>
            <p>3. El tutor programará una fecha y hora para la sesión</p>
            <p>4. Recibirás una notificación con los detalles de tu tutoría</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
