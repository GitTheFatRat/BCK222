import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

function signToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
    });
}

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password_hash,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// POST /api/auth/login
export async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);

        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                banner: user.banner,
                description: user.description,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password_hash')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.json(user)
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const { username, email, password, currentPassword, description } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only require current password if they are changing email, password, or username
        if (email || password || username) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to change email or password' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }
        }

        if (username) {
            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
            }
            try {
                const existingUser = await User.findOne({ username, _id: { $ne: userId } });
                if (existingUser) {
                    return res.status(400).json({ message: 'Username đã được sử dụng' });
                }
                user.username = username;
            } catch (dbError) {
                if (dbError.code === 11000) {
                    return res.status(400).json({ message: 'Username đã được sử dụng' });
                }
                throw dbError;
            }
        }

        if (email) {
            try {
                const existingUser = await User.findOne({ email, _id: { $ne: userId } });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email da duoc su dung' });
                }
                user.email = email;
            } catch (dbError) {
                if (dbError.code === 11000) {
                    return res.status(400).json({ message: 'Email da duoc su dung' });
                }
                throw dbError;
            }
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            user.password_hash = await bcrypt.hash(password, salt);
        }

        if (description !== undefined) {
            user.description = description;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                banner: user.banner,
                description: user.description,
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function uploadAvatar(req, res) {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        user.avatar = avatarUrl;
        await user.save();

        res.json({
            message: 'Avatar updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                banner: user.banner,
                description: user.description,
            }
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function uploadBanner(req, res) {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bannerUrl = `/uploads/banners/${req.file.filename}`;
        user.banner = bannerUrl;
        await user.save();

        res.json({
            message: 'Banner updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                banner: user.banner,
                description: user.description,
            }
        });
    } catch (error) {
        console.error('Upload banner error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}