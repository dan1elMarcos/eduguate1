// Check if user is authenticated
async function checkAuth() {
  const supabase = window.supabaseClient
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Get current user profile
async function getCurrentUserProfile() {
  const supabase = window.supabaseClient
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}

// Logout function
async function logout() {
  const supabase = window.supabaseClient
  await supabase.auth.signOut()
  window.location.href = "index.html"
}

// Protect pages that require authentication
async function protectPage(requiredRole = null) {
  const session = await checkAuth()

  if (!session) {
    window.location.href = "login.html"
    return null
  }

  const profile = await getCurrentUserProfile()

  if (requiredRole && profile.role !== requiredRole) {
    window.location.href = profile.role === "student" ? "dashboard-student.html" : "dashboard-tutor.html"
    return null
  }

  return profile
}

// Export functions
window.authFunctions = {
  checkAuth,
  getCurrentUserProfile,
  logout,
  protectPage,
}
