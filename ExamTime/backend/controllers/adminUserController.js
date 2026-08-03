import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password_hash').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ username, email và password.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username hoặc Email đã được sử dụng.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password_hash,
            role: role || 'student',
        });

        await newUser.save();
        const userResponse = newUser.toObject();
        delete userResponse.password_hash;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo người dùng.' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // Check for duplicates if email or username is changing
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: 'Email đã được sử dụng bởi tài khoản khác.' });
            user.email = email;
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) return res.status(400).json({ message: 'Username đã được sử dụng bởi tài khoản khác.' });
            user.username = username;
        }

        if (role) {
            user.role = role;
        }

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(password, salt);
        }

        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password_hash;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng.' });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting oneself
        if (id === req.user.userId) {
            return res.status(400).json({ message: 'Bạn không thể xóa chính mình.' });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        res.status(200).json({ message: 'Xóa người dùng thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa người dùng.' });
    }
};
