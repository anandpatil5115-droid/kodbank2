import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

let toastIdCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = ++toastIdCounter;

        setToasts(prev => [...prev, { id, type, title, message, duration }]);

        timersRef.current[id] = setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 200);
    }, []);

    const pauseToast = useCallback((id) => {
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    }, []);

    const resumeToast = useCallback((id, remainingTime) => {
        timersRef.current[id] = setTimeout(() => {
            removeToast(id);
        }, remainingTime);
    }, [removeToast]);

    const success = useCallback((title, message) => addToast({ type: 'success', title, message }), [addToast]);
    const error = useCallback((title, message) => addToast({ type: 'error', title, message }), [addToast]);
    const warning = useCallback((title, message) => addToast({ type: 'warning', title, message }), [addToast]);
    const info = useCallback((title, message) => addToast({ type: 'info', title, message }), [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, pauseToast, resumeToast, success, error, warning, info }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
