import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfetti } from '../components/animations/Confetti';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

function getPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', 'weak', 'fair', 'good', 'strong'];

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [shaking, setShaking] = useState(false);
    const { register } = useAuth();
    const toast = useToast();
    const { fireConfetti } = useConfetti();
    const navigate = useNavigate();

    const strength = getPasswordStrength(form.password);

    const validate = () => {
        const e = {};
        if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters';
        if (!form.email || !/@/.test(form.email)) e.email = 'Valid email is required (e.g. name@demo)';
        if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
            return;
        }

        setLoading(true);
        try {
            await register(form);
            fireConfetti();
            toast.success('Account Created! 🎉', 'Welcome to KodBank! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error('Registration Failed', err.message);
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
            <div className="auth-split">
                {/* Left Panel */}
                <motion.div
                    className="auth-left"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="auth-left-content">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ fontSize: '80px', marginBottom: '24px' }}
                        >
                            🏦
                        </motion.div>
                        <h1>Welcome to<br />KodBank</h1>
                        <p>Your premium banking experience starts here. Secure, fast, and beautifully crafted.</p>

                        <motion.div
                            style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'center' }}
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                        >
                            {['🔒 Secure', '⚡ Fast', '✨ Premium'].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        border: '1px solid var(--bg-glass-border)'
                                    }}
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Panel — Form */}
                <div className="auth-right">
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className={`auth-card glass-card ${shaking ? 'form-shake' : ''}`}
                        >
                            <motion.div variants={stagger} initial="hidden" animate="show">
                                <motion.div variants={fadeUp}>
                                    <h2>Create Account</h2>
                                    <p className="subtitle">Join KodBank today — it takes less than a minute</p>
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Input
                                        icon={FiUser}
                                        label="Username"
                                        value={form.username}
                                        onChange={handleChange('username')}
                                        error={errors.username}
                                        autoComplete="username"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Input
                                        icon={FiMail}
                                        label="Email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange('email')}
                                        error={errors.email}
                                        autoComplete="email"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Input
                                        icon={FiLock}
                                        label="Password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange('password')}
                                        error={errors.password}
                                        autoComplete="new-password"
                                    />
                                    {form.password && (
                                        <>
                                            <div className="password-strength">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div
                                                        key={i}
                                                        className={`strength-bar ${i <= strength ? strengthColors[strength] : ''}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className={`strength-text`} style={{ color: `var(--${strength >= 3 ? 'green' : strength >= 2 ? 'gold' : 'red'}-500)` }}>
                                                {strengthLabels[strength]}
                                            </div>
                                        </>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Input
                                        icon={FiPhone}
                                        label="Phone (optional)"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange('phone')}
                                        autoComplete="tel"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        loading={loading}
                                        style={{ width: '100%', marginTop: '8px', padding: '14px' }}
                                    >
                                        Create Account
                                    </Button>
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <div className="auth-footer">
                                        Already have an account? <Link to="/login">Sign in</Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
