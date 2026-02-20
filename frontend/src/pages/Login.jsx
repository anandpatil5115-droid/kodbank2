import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfetti } from '../components/animations/Confetti';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [shaking, setShaking] = useState(false);
    const { login } = useAuth();
    const toast = useToast();
    const { fireConfetti } = useConfetti();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setErrors({
                username: !form.username ? 'Username is required' : '',
                password: !form.password ? 'Password is required' : ''
            });
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
            return;
        }

        setLoading(true);
        try {
            await login(form);
            fireConfetti();
            toast.success('Welcome Back! 🎉', 'Login successful! Entering your dashboard...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            toast.error('Login Failed', err.message);
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
        <div className="login-fullscreen">
            {/* Full-screen background image */}
            <div className="login-bg-image" />
            {/* Gradient overlay for readability */}
            <div className="login-bg-overlay" />

            {/* Content layer */}
            <div className="login-content">
                {/* Left side — Welcome text */}
                <motion.div
                    className="login-left"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="login-welcome">
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ fontSize: '56px', marginBottom: '16px' }}
                        >
                            🏦
                        </motion.div>
                        <h1 className="login-welcome-title">
                            Welcome<br />Back
                        </h1>
                        <p className="login-welcome-desc">
                            Your premium banking experience awaits. Secure, fast, and beautifully crafted for modern banking.
                        </p>
                        <div className="login-welcome-badges">
                            <span>🔒 Secure</span>
                            <span>⚡ Fast</span>
                            <span>✨ Premium</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right side — Sign in form */}
                <motion.div
                    className="login-right"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                >
                    <form
                        onSubmit={handleSubmit}
                        className={`login-form ${shaking ? 'form-shake' : ''}`}
                    >
                        <h2 className="login-form-title">Sign in</h2>

                        <Input
                            icon={FiUser}
                            label="Username"
                            value={form.username}
                            onChange={handleChange('username')}
                            error={errors.username}
                            autoComplete="username"
                        />

                        <Input
                            icon={FiLock}
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            variant="gold"
                            loading={loading}
                            style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '16px', borderRadius: '8px' }}
                        >
                            Sign in now
                        </Button>

                        <div className="login-form-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="login-link">Create one</Link>
                            </p>
                            <p className="login-terms">
                                By signing in you agree to our{' '}
                                <span>Terms of Service</span> | <span>Privacy Policy</span>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
