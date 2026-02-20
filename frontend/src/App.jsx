import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import AnimatedBackground from './components/animations/AnimatedBackground';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/ui/ToastContainer';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ minHeight: '100vh' }}
            >
                <Routes location={location}>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <Router>
                    <AuthProvider>
                        <AnimatedBackground />
                        <Navbar />
                        <ToastContainer />
                        <AnimatedRoutes />
                    </AuthProvider>
                </Router>
            </ToastProvider>
        </ThemeProvider>
    );
}
