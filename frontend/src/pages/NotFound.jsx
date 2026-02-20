import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function NotFound() {
    return (
        <div className="page-container">
            <div className="error-page">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="error-code">404</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="error-title">Page Not Found</div>
                    <div className="error-desc">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/">
                        <Button variant="primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                            🏠 Back to Home
                        </Button>
                    </Link>
                </motion.div>

                {/* Floating decorative elements */}
                {['💳', '🏦', '💰'].map((emoji, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            fontSize: '40px',
                            opacity: 0.15,
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 15}%`
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.5
                        }}
                    >
                        {emoji}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
