import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/common/Toast";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ReadAloudWidget from "@/components/common/ReadAloudWidget";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
              <Navbar />
              <main id="main-content" className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
              <ReadAloudWidget />
            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
