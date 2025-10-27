"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, GraduationCap, Calendar, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  role: "student" | "tutor"
}

export function Navigation({ role }: NavigationProps) {
  const pathname = usePathname()

  const studentLinks = [
    { href: "/dashboard/student", label: "Inicio", icon: Home },
    { href: "/dashboard/student/subjects", label: "Materias", icon: BookOpen },
    { href: "/dashboard/student/evaluations", label: "Evaluaciones", icon: GraduationCap },
    { href: "/dashboard/student/tutoring", label: "Tutorías", icon: Calendar },
    { href: "/dashboard/student/forum", label: "Foro", icon: MessageSquare },
    { href: "/dashboard/student/profile", label: "Perfil", icon: User },
  ]

  const tutorLinks = [
    { href: "/dashboard/tutor", label: "Inicio", icon: Home },
    { href: "/dashboard/tutor/requests", label: "Solicitudes", icon: Calendar },
    { href: "/dashboard/tutor/content", label: "Contenidos", icon: BookOpen },
    { href: "/dashboard/tutor/evaluations", label: "Evaluaciones", icon: GraduationCap },
    { href: "/dashboard/tutor/forum", label: "Foro", icon: MessageSquare },
    { href: "/dashboard/tutor/profile", label: "Perfil", icon: User },
  ]

  const links = role === "student" ? studentLinks : tutorLinks

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
