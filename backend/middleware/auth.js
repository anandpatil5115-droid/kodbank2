import jwt from 'jsonwebtoken';
import supabase from '../db.js';

export async function verifyToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check token exists in database and is not expired
        const { data: tokenRecord, error } = await supabase
            .from('usertoken')
            .select('*')
            .eq('token', token)
            .single();

        if (error || !tokenRecord) {
            return res.status(401).json({ error: 'Invalid or expired session.' });
        }

        if (new Date(tokenRecord.expiry) < new Date()) {
            // Clean up expired token
            await supabase.from('usertoken').delete().eq('tid', tokenRecord.tid);
            return res.status(401).json({ error: 'Session expired. Please login again.' });
        }

        req.user = {
            uid: decoded.uid,
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired. Please login again.' });
        }
        return res.status(401).json({ error: 'Invalid token.' });
    }
}
