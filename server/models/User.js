import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        select: false
    },
    role: { type: String, enum: ["admin", "owner", "user"], default: 'user' },
    image: { type: String, default: '' },
    googleId: { type: String },
    refreshToken: { type: String, select: false },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Comparison method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword = this.password) {
    if (!userPassword) return false;

    // Support legacy plain-text records until they are updated.
    if (!userPassword.startsWith("$2")) {
        return candidatePassword === userPassword;
    }

    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User
