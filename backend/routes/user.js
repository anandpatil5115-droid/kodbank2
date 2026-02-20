import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import supabase from '../db.js';

const router = Router();

// GET /api/user/balance
router.get('/balance', verifyToken, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('koduser')
            .select('balance, username')
            .eq('uid', req.user.uid)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.json({
            message: `Your balance is: ₹${Number(user.balance).toLocaleString('en-IN')}`,
            balance: Number(user.balance),
            username: user.username
        });
    } catch (err) {
        console.error('Balance error:', err);
        return res.status(500).json({ error: 'Failed to fetch balance.' });
    }
});

// GET /api/user/profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('koduser')
            .select('uid, username, email, phone, role, balance, created_at')
            .eq('uid', req.user.uid)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.json({ user });
    } catch (err) {
        console.error('Profile error:', err);
        return res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

export default router;
