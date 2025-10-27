"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { BookOpen } from "lucide-react"
import type { UserRole, EducationLevel } from "@/lib/types"

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    role: "" as UserRole,
    educationLevel: "" as EducationLevel,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)
      setUserEmail(user.email || "")

      // Check if profile already exists
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        // Profile exists, redirect to dashboard
        if (profile.role === "student") {
          router.push("/dashboard/student")
        } else {
          router.push("/dashboard/tutor")
        }
      }
    }

    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.role) {
      setError("Por favor selecciona un tipo de usuario")
      setIsLoading(false)
      return
    }

    if (!userId) {
      setError("Error: Usuario no encontrado")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        email: userEmail,
        full_name: formData.fullName,
        age: formData.age ? Number.parseInt(formData.age) : null,
        role: formData.role,
        education_level: formData.educationLevel || null,
      })

      if (profileError) throw profileError

      // Redirect based on role
      if (formData.role === "student") {
        router.push("/dashboard/student")
      } else {
        router.push("/dashboard/tutor")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al completar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">EduGuate</h1>
          <p className="text-muted-foreground">Completa tu perfil</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Información de Perfil</CardTitle>
            <CardDescription>Completa tu información para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="15"
                    min="5"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Tipo de Usuario</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === "student" && (
                  <div className="grid gap-2">
                    <Label htmlFor="educationLevel">Nivel Educativo</Label>
                    <Select
                      value={formData.educationLevel}
                      onValueChange={(value: EducationLevel) => setFormData({ ...formData, educationLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primaria">Primaria</SelectItem>
                        <SelectItem value="basicos">Básicos</SelectItem>
                        <SelectItem value="diversificado">Diversificado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Continuar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
