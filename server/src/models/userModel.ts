import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'artisan', 'admin'],
        default: 'customer'
    },
    avatar: { type: String },
    artisanProfile: {
        bio: String,
        shopName: String,
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next: any) {
    if (!this.isModified('password')) {
        // @ts-ignore
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
