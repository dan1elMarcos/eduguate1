export type UserRole = "student" | "tutor"
export type EducationLevel = "primaria" | "basicos" | "diversificado"
export type SubjectType = "matematicas" | "lenguaje" | "ciencias" | "sociales" | "ingles"
export type TutoringStatus = "pending" | "accepted" | "completed" | "cancelled"

export interface Profile {
  id: string
  email: string
  full_name: string
  age?: number
  role: UserRole
  education_level?: EducationLevel
  created_at: string
  updated_at: string
}

export interface EducationalContent {
  id: string
  subject: SubjectType
  title: string
  description?: string
  content: string
  education_level: EducationLevel
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Evaluation {
  id: string
  subject: SubjectType
  title: string
  description?: string
  education_level: EducationLevel
  questions: Question[]
  created_by?: string
  created_at: string
}

export interface Question {
  question: string
  options: string[]
  correct: number
}

export interface EvaluationResult {
  id: string
  evaluation_id: string
  student_id: string
  answers: number[]
  score?: number
  completed_at: string
}

export interface TutoringRequest {
  id: string
  student_id: string
  tutor_id?: string
  subject: SubjectType
  description: string
  status: TutoringStatus
  scheduled_date?: string
  created_at: string
  updated_at: string
}

export interface ForumPost {
  id: string
  author_id: string
  subject?: SubjectType
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface ForumComment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
}
