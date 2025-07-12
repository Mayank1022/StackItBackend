import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Navbar } from "./components/Navbar"
import { LandingPage } from "./pages/LandingPage"
import { HomePage } from "./pages/HomePage"
import { AskQuestionPage } from "./pages/AskQuestionPage"
import { QuestionDetailPage } from "./pages/QuestionDetailPage"
import { AboutPage } from "./pages/AboutPage"
import { ContactPage } from "./pages/ContactPage"
import { LoginPage } from "./pages/LoginPage"
import { SignUpPage } from "./pages/SignUpPage"
import { Toaster } from "./components/ui/Toaster"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/questions" element={<HomePage />} />
              <Route path="/ask" element={<AskQuestionPage />} />
              <Route path="/questions/:id" element={<QuestionDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
