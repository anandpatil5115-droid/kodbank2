import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign, FiCreditCard, FiTrendingUp, FiSend,
    FiHome, FiActivity, FiSettings, FiShield, FiCpu
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfetti } from '../components/animations/Confetti';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useTilt } from '../hooks/useTilt';
import FloatingElements from '../components/animations/FloatingElements';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const sidebarItems = [
    { icon: FiHome, label: 'Overview', active: true },
    { icon: FiActivity, label: 'Transactions' },
    { icon: FiCreditCard, label: 'Cards' },
    { icon: FiSend, label: 'Transfers' },
    { icon: FiTrendingUp, label: 'Investments' },
    { icon: FiSettings, label: 'Settings' },
    { icon: FiCpu, label: 'KodAssist' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
};

export default function Dashboard() {
    const { user, checkAuth, getBalance, loading: authLoading, logout } = useAuth();
    const [balance, setBalance] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const [showBgFlash, setShowBgFlash] = useState(false);
    const [checked, setChecked] = useState(false);
    const toast = useToast();
    const { fireBalanceCelebration } = useConfetti();
    const counter = useAnimatedCounter(balance || 0, 1500, false);
    const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = useTilt(6);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth().then(() => setChecked(true));
    }, []);

    useEffect(() => {
        if (checked && !authLoading && !user) {
            navigate('/login');
        }
    }, [checked, authLoading, user, navigate]);

    const handleCheckBalance = useCallback(async () => {
        setBalanceLoading(true);
        try {
            const data = await getBalance();
            setBalance(data.balance);
            counter.startAnimation(0);

            // Trigger celebration
            fireBalanceCelebration();
            setCelebrating(true);
            setShowBgFlash(true);
            setTimeout(() => setShowBgFlash(false), 1000);
            setTimeout(() => setCelebrating(false), 3000);

            toast.success('Balance Retrieved! 💰', data.message);
        } catch (err) {
            toast.error('Error', err.message);
        } finally {
            setBalanceLoading(false);
        }
    }, [getBalance, fireBalanceCelebration, toast]);

    if (!checked || authLoading) {
        return (
            <div className="page-container">
                <div className="dashboard">
                    <div className="sidebar">
                        {sidebarItems.map((item, i) => (
                            <div key={i} className="skeleton" style={{ height: 44, borderRadius: 'var(--radius-md)', marginBottom: 8 }} />
                        ))}
                    </div>
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="page-container">
            {/* Background flash on celebration */}
            <AnimatePresence>
                {showBgFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-flash"
                    />
                )}
            </AnimatePresence>

            {/* Floating celebration emojis */}
            <FloatingElements show={celebrating} />

            <div className="dashboard">
                {/* Sidebar — Solid Surface */}
                <motion.aside
                    className="sidebar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div style={{ marginBottom: '16px', padding: '0 16px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Navigation
                        </div>
                    </div>
                    {sidebarItems.map((item, i) => (
                        <button
                            key={i}
                            className={`sidebar-item ${item.active ? 'active' : ''}`}
                        >
                            <item.icon className="sidebar-icon" />
                            {item.label}
                        </button>
                    ))}

                    <div style={{ marginTop: 'auto', padding: '16px' }}>
                        <div style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--card-elevated)',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <FiShield style={{ fontSize: '24px', color: 'var(--green-500)', marginBottom: '8px' }} />
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Account Secured</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>256-bit encryption</div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    {/* Welcome Header */}
                    <motion.div
                        className="welcome-header"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1>
                            Welcome back,{' '}
                            <span style={{ color: 'var(--accent)' }}>
                                {user.username}
                            </span>{' '}
                            👋
                        </h1>
                        <p>Here's your financial overview for today</p>
                    </motion.div>

                    {/* Balance Card */}
                    <motion.div
                        ref={tiltRef}
                        style={{ ...tiltStyle, maxWidth: '500px' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                    >
                        <div className="balance-card">
                            <div className="balance-label">Total Balance</div>
                            <div className="balance-amount">
                                {balance !== null ? counter.formatted : '₹ ••••••'}
                            </div>
                            <div className="balance-user">{user.username} • {user.role}</div>
                            <div className="card-decoration">💳</div>
                        </div>
                    </motion.div>

                    {/* Check Balance Button */}
                    <motion.div
                        custom={2}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        style={{ marginTop: '24px' }}
                    >
                        <Button
                            variant="gold"
                            loading={balanceLoading}
                            onClick={handleCheckBalance}
                            style={{
                                padding: '14px 32px',
                                fontSize: '16px',
                                animation: !balance && !balanceLoading ? 'glowPulse 2s infinite' : 'none'
                            }}
                        >
                            <FiDollarSign /> Check Balance
                        </Button>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '40px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                            Quick Actions
                        </h3>
                        <div className="quick-actions">
                            {[
                                { icon: '💸', title: 'Send Money', desc: 'Transfer to anyone instantly' },
                                { icon: '📊', title: 'Analytics', desc: 'View spending insights' },
                                { icon: '🔔', title: 'Notifications', desc: 'Manage your alerts' },
                            ].map((action, i) => (
                                <motion.div
                                    key={i}
                                    className="action-card"
                                    whileHover={{ y: -6 }}
                                    custom={4 + i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <div className="action-icon">{action.icon}</div>
                                    <div className="action-title">{action.title}</div>
                                    <div className="action-desc">{action.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
