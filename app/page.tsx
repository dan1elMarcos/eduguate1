import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, GraduationCap, Calendar, MessageSquare, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduGuate</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#materias" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Materias
            </Link>
            <Link href="#tutorias" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Tutorías
            </Link>
            <Link href="#comunidad" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Comunidad
            </Link>
            <Link href="#contacto" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight text-foreground md:text-6xl">
              Educación Gratuita y Accesible para Todos
            </h1>
            <p className="mb-8 text-pretty text-xl text-muted-foreground">
              Accede a contenidos educativos de calidad, conecta con tutores y aprende a tu propio ritmo. EduGuate está
              diseñado especialmente para estudiantes en zonas rurales de Guatemala.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/register">Comenzar Gratis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#materias">Explorar Materias</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">¿Qué Ofrece EduGuate?</h2>
            <p className="text-lg text-muted-foreground">
              Una plataforma completa para tu educación, diseñada pensando en ti
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Contenidos por Materia</CardTitle>
                <CardDescription>
                  Accede a lecciones de Matemáticas, Lenguaje, Ciencias y más, organizadas por nivel educativo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Tutorías Personalizadas</CardTitle>
                <CardDescription>
                  Conecta con tutores voluntarios que te ayudarán a resolver tus dudas y mejorar tu aprendizaje
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Evaluaciones Interactivas</CardTitle>
                <CardDescription>
                  Pon a prueba tus conocimientos con evaluaciones y recibe retroalimentación inmediata
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Calendario de Tutorías</CardTitle>
                <CardDescription>
                  Programa sesiones de tutoría según tu disponibilidad y mantén un seguimiento de tu progreso
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Comunidad Educativa</CardTitle>
                <CardDescription>
                  Participa en foros, comparte dudas y aprende junto a otros estudiantes de toda Guatemala
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Acceso Offline</CardTitle>
                <CardDescription>
                  Descarga contenidos para estudiar sin conexión, ideal para zonas con conectividad limitada
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="materias" className="w-full bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Materias Disponibles</h2>
            <p className="text-lg text-muted-foreground">Contenido educativo organizado por área de conocimiento</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Matemáticas",
                description: "Aritmética, álgebra, geometría y más",
                color: "bg-blue-500",
              },
              {
                name: "Lenguaje",
                description: "Gramática, ortografía y comprensión lectora",
                color: "bg-green-500",
              },
              {
                name: "Ciencias",
                description: "Biología, química, física y ciencias naturales",
                color: "bg-purple-500",
              },
              {
                name: "Ciencias Sociales",
                description: "Historia, geografía y estudios sociales",
                color: "bg-orange-500",
              },
              {
                name: "Inglés",
                description: "Vocabulario, gramática y conversación",
                color: "bg-pink-500",
              },
            ].map((subject) => (
              <Card key={subject.name} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-2 h-2 w-full rounded-full ${subject.color}`} />
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/auth/register">Comenzar a Aprender</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="tutorias" className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary to-secondary p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              ¿Listo para Comenzar tu Viaje Educativo?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Únete a cientos de estudiantes que ya están mejorando su educación con EduGuate
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">Registrarse como Estudiante</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/auth/register">Registrarse como Tutor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="w-full border-t border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">EduGuate</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Educación gratuita y accesible para todos los estudiantes de Guatemala
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#materias" className="hover:text-foreground">
                    Materias
                  </Link>
                </li>
                <li>
                  <Link href="#tutorias" className="hover:text-foreground">
                    Tutorías
                  </Link>
                </li>
                <li>
                  <Link href="#comunidad" className="hover:text-foreground">
                    Comunidad
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-foreground">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Contacto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: contacto@eduguate.gt</li>
                <li>Teléfono: +502 1234-5678</li>
                <li>Guatemala, Guatemala</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EduGuate. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
