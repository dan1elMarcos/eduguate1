"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import type { SubjectType, EducationLevel, Question } from "@/lib/types"

export default function NewEvaluationPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "" as SubjectType,
    educationLevel: "" as EducationLevel,
  })
  const [questions, setQuestions] = useState<Question[]>([{ question: "", options: ["", "", "", ""], correct: 0 }])
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

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correct: 0 }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | number | string[]) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    const newOptions = [...newQuestions[questionIndex].options]
    newOptions[optionIndex] = value
    newQuestions[questionIndex].options = newOptions
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.subject || !formData.educationLevel) {
      setError("Por favor completa todos los campos requeridos")
      setIsLoading(false)
      return
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question || q.options.some((opt) => !opt)) {
        setError("Por favor completa todas las preguntas y opciones")
        setIsLoading(false)
        return
      }
    }

    if (!userId) {
      setError("Error: Usuario no encontrado")
      setIsLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from("evaluations").insert({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        education_level: formData.educationLevel,
        questions: questions,
        created_by: userId,
      })

      if (insertError) throw insertError

      router.push("/dashboard/tutor/evaluations")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear la evaluación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="tutor" userName={userName}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tutor/evaluations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crear Evaluación</h1>
            <p className="text-muted-foreground">Diseña una evaluación para medir el progreso</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Evaluación</CardTitle>
              <CardDescription>Detalles generales de la evaluación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ej: Evaluación de Suma y Resta"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Breve descripción de la evaluación"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
              </div>
            </CardContent>
          </Card>

          {questions.map((question, qIndex) => (
            <Card key={qIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pregunta {qIndex + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor={`question-${qIndex}`}>Pregunta</Label>
                  <Input
                    id={`question-${qIndex}`}
                    type="text"
                    placeholder="Escribe la pregunta aquí"
                    required
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opciones de Respuesta</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder={`Opción ${oIndex + 1}`}
                        required
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correct === oIndex}
                        onChange={() => updateQuestion(qIndex, "correct", oIndex)}
                        className="h-4 w-4"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">Selecciona la opción correcta con el botón de radio</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addQuestion} className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Pregunta
          </Button>

          {error && (
            <Card>
              <CardContent className="py-4">
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/dashboard/tutor/evaluations">Cancelar</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Evaluación"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
