import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const { theme, toggleTheme, rotating } = useTheme();

    return (
        <button
            className={`theme-toggle ${rotating ? 'rotating' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
    );
}
