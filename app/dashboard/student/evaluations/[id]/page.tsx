"use client"

import { use, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Evaluation, Profile } from "@/lib/types"

export default function EvaluationTakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!profileData || profileData.role !== "student") {
        router.push("/auth/complete-profile")
        return
      }

      setProfile(profileData)

      const { data: evaluationData } = await supabase.from("evaluations").select("*").eq("id", id).single()

      if (evaluationData) {
        setEvaluation(evaluationData as Evaluation)
        setAnswers(new Array(evaluationData.questions.length).fill(-1))

        // Check if already completed
        const { data: resultData } = await supabase
          .from("evaluation_results")
          .select("*")
          .eq("evaluation_id", id)
          .eq("student_id", user.id)
          .single()

        if (resultData) {
          setIsSubmitted(true)
          setScore(resultData.score)
          setAnswers(resultData.answers)
        }
      }
    }

    fetchData()
  }, [id, router, supabase])

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (!profile || !evaluation) return

    if (answers.some((a) => a === -1)) {
      setError("Por favor responde todas las preguntas")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Calculate score
      let correct = 0
      evaluation.questions.forEach((q, i) => {
        if (q.correct === answers[i]) {
          correct++
        }
      })

      const finalScore = Math.round((correct / evaluation.questions.length) * 100)

      const { error: insertError } = await supabase.from("evaluation_results").insert({
        evaluation_id: evaluation.id,
        student_id: profile.id,
        answers: answers,
        score: finalScore,
      })

      if (insertError) throw insertError

      setScore(finalScore)
      setIsSubmitted(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al enviar la evaluación")
    } finally {
      setIsLoading(false)
    }
  }

  if (!evaluation || !profile) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student" userName={profile.full_name}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/student/evaluations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{evaluation.title}</h1>
            <p className="text-muted-foreground">
              {evaluation.subject} - {evaluation.education_level}
            </p>
          </div>
        </div>

        {evaluation.description && (
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{evaluation.description}</p>
            </CardContent>
          </Card>
        )}

        {isSubmitted && score !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Tu calificación en esta evaluación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-primary">{score}%</div>
                <p className="mt-2 text-muted-foreground">
                  {score >= 80 ? "¡Excelente trabajo!" : score >= 60 ? "Buen trabajo" : "Sigue practicando"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {evaluation.questions.map((question, qIndex) => (
          <Card key={qIndex}>
            <CardHeader>
              <CardTitle>
                Pregunta {qIndex + 1} de {evaluation.questions.length}
              </CardTitle>
              <CardDescription>{question.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[qIndex]?.toString()}
                onValueChange={(value) => handleAnswerChange(qIndex, Number.parseInt(value))}
                disabled={isSubmitted}
              >
                {question.options.map((option, oIndex) => {
                  const isCorrect = question.correct === oIndex
                  const isSelected = answers[qIndex] === oIndex
                  const showResult = isSubmitted

                  return (
                    <div
                      key={oIndex}
                      className={`flex items-center space-x-2 rounded-lg border p-4 ${
                        showResult && isCorrect
                          ? "border-green-500 bg-green-500/10"
                          : showResult && isSelected && !isCorrect
                            ? "border-red-500 bg-red-500/10"
                            : ""
                      }`}
                    >
                      <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                      <Label htmlFor={`q${qIndex}-o${oIndex}`} className="flex-1 cursor-pointer">
                        {option}
                        {showResult && isCorrect && (
                          <span className="ml-2 text-sm font-semibold text-green-600">✓ Correcta</span>
                        )}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        {error && (
          <Card>
            <CardContent className="py-4">
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            </CardContent>
          </Card>
        )}

        {!isSubmitted && (
          <div className="flex gap-4">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/dashboard/student/evaluations">Cancelar</Link>
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Evaluación"}
            </Button>
          </div>
        )}

        {isSubmitted && (
          <Button asChild className="w-full">
            <Link href="/dashboard/student/evaluations">Volver a Evaluaciones</Link>
          </Button>
        )}
      </div>
    </DashboardLayout>
  )
}
