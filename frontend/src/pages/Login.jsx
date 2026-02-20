import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfetti } from '../components/animations/Confetti';
import { useTilt } from '../hooks/useTilt';
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
    const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = useTilt(8);
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
        <div className="page-container">
            <div className="login-page">
                {/* Full-screen background image */}
                <div className="login-background" />
                <div className="login-overlay" />

                {/* Subtle floating shapes (very low opacity, on top of overlay) */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
                    {[
                        { size: 300, x: '10%', y: '20%', delay: 0, color: 'rgba(245,158,11,0.06)' },
                        { size: 200, x: '70%', y: '60%', delay: 3, color: 'rgba(255,255,255,0.04)' },
                        { size: 250, x: '50%', y: '80%', delay: 6, color: 'rgba(245,158,11,0.04)' },
                    ].map((orb, i) => (
                        <motion.div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: orb.size,
                                height: orb.size,
                                borderRadius: '50%',
                                background: orb.color,
                                left: orb.x,
                                top: orb.y,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 15, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: orb.delay
                            }}
                        />
                    ))}
                </div>

                {/* Login Card — Solid, elevated */}
                <motion.div
                    ref={tiltRef}
                    style={{ ...tiltStyle, position: 'relative', zIndex: 2 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <form
                        onSubmit={handleSubmit}
                        className={`login-card ${shaking ? 'form-shake' : ''}`}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ fontSize: '48px', marginBottom: '16px', display: 'inline-block' }}
                            >
                                🏦
                            </motion.div>
                        </div>

                        <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
                        <p className="subtitle" style={{ textAlign: 'center' }}>Sign in to your KodBank account</p>

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
                            variant="primary"
                            loading={loading}
                            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
                        >
                            Sign In
                        </Button>

                        <div className="auth-footer">
                            Don't have an account? <Link to="/register">Create one</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
