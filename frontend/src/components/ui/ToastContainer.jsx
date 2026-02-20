import { useEffect, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertTriangle,
    info: FiInfo
};

function Toast({ id, type, title, message, duration, exiting }) {
    const { removeToast, pauseToast, resumeToast } = useToast();
    const [progress, setProgress] = useState(100);
    const startTime = useRef(Date.now());
    const remaining = useRef(duration);
    const frameRef = useRef(null);
    const Icon = icons[type] || FiInfo;

    useEffect(() => {
        const tick = () => {
            const elapsed = Date.now() - startTime.current;
            const pct = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(pct);
            if (pct > 0) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };
        frameRef.current = requestAnimationFrame(tick);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [duration]);

    const handleMouseEnter = () => {
        remaining.current = (progress / 100) * duration;
        pauseToast(id);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };

    const handleMouseLeave = () => {
        startTime.current = Date.now() - ((100 - progress) / 100) * duration;
        resumeToast(id, remaining.current);
        const tick = () => {
            const elapsed = Date.now() - startTime.current;
            const pct = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(pct);
            if (pct > 0) frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
    };

    return (
        <div
            className={`toast toast-${type} ${exiting ? 'exiting' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="toast-icon"><Icon /></span>
            <div className="toast-body">
                <div className="toast-title">{title}</div>
                {message && <div className="toast-message">{message}</div>}
            </div>
            <button className="toast-close" onClick={() => removeToast(id)}>
                <FiX />
            </button>
            <div className="toast-progress" style={{ width: `${progress}%` }} />
        </div>
    );
}

export default function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
}
