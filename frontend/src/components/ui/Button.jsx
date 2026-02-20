import { useRef } from 'react';

export default function Button({ children, className = '', variant = 'primary', loading = false, onClick, ...props }) {
    const btnRef = useRef(null);

    const handleClick = (e) => {
        if (loading || props.disabled) return;

        // Ripple effect
        const btn = btnRef.current;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        onClick?.(e);
    };

    return (
        <button
            ref={btnRef}
            className={`btn btn-${variant} ${loading ? 'btn-loading' : ''} ${className}`}
            onClick={handleClick}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? <span className="spinner" /> : children}
        </button>
    );
}
