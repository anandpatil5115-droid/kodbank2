import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Input({
    icon: Icon,
    label,
    type = 'text',
    error,
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={`input-group ${className}`}>
            {Icon && <span className="input-icon"><Icon /></span>}
            <input
                type={isPassword && showPassword ? 'text' : type}
                className={`input-field ${error ? 'input-error' : ''}`}
                placeholder={label || ' '}
                {...props}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        zIndex: 1
                    }}
                >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
            )}
            {error && <div className="input-error-msg">{error}</div>}
        </div>
    );
}
