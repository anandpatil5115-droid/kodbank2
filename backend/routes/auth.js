import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import supabase from '../db.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().regex(/@/, { message: "Invalid email" }),
    password: z.string().min(6),
    phone: z.string().optional()
});

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.errors.map(e => e.message)
            });
        }

        const { username, email, password, phone } = parsed.data;

        // Check if username or email already exists
        const { data: existingUser } = await supabase
            .from('koduser')
            .select('uid')
            .or(`username.eq.${username},email.eq.${email}`)
            .limit(1);

        if (existingUser && existingUser.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const uid = uuidv4();
        const { data: newUser, error } = await supabase
            .from('koduser')
            .insert({
                uid,
                username,
                email,
                password: hashedPassword,
                balance: 100000.00,
                phone: phone || null,
                role: 'customer'
            })
            .select('uid, username, email, balance, role')
            .single();

        if (error) {
            console.error('Register error:', error);
            return res.status(500).json({ error: 'Failed to create account. Please try again.' });
        }

        return res.status(201).json({
            message: 'Account created successfully!',
            user: newUser
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Please provide username and password.' });
        }

        const { username, password } = parsed.data;

        // Find user
        const { data: user, error } = await supabase
            .from('koduser')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { uid: user.uid, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Store token in database
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const { error: tokenErr } = await supabase
            .from('usertoken')
            .insert({
                tid: uuidv4(),
                token,
                uid: user.uid,
                expiry
            });

        if (tokenErr) {
            console.error('Token storage error:', tokenErr);
            return res.status(500).json({ error: 'Login failed. Please try again.' });
        }

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });

        return res.json({
            message: 'Login successful!',
            user: {
                uid: user.uid,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (token) {
            // Delete token from database
            await supabase.from('usertoken').delete().eq('token', token);
        }

        res.clearCookie('token', { path: '/' });
        return res.json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed.' });
    }
});

// GET /api/auth/me - Check current session
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { data: user, error } = await supabase
            .from('koduser')
            .select('uid, username, email, role, balance')
            .eq('uid', decoded.uid)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Session invalid.' });
        }

        return res.json({ user });
    } catch (err) {
        return res.status(401).json({ error: 'Session expired.' });
    }
});

export default router;
