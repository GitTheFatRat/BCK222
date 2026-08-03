import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student',
        },
        avatar: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
            maxlength: 500,
        },
        banner: {
            type: String,
            default: '',
        }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);