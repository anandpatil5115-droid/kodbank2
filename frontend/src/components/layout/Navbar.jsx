import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Button from '../ui/Button';
import { FiLogOut } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">🏦</span>
                KodBank
            </Link>

            <div className="navbar-actions">
                <ThemeToggle />
                {user ? (
                    <Button variant="ghost" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '14px' }}>
                        <FiLogOut /> Logout
                    </Button>
                ) : (
                    <Link to="/login">
                        <Button variant="primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
