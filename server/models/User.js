import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner", "user"], default: 'user' },
    image: { type: String, default: '' },
    googleId: { type: String },
    refreshToken: { type: String, select: false },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Comparison method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User