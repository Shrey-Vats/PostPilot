import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: "user", enum: ["user", "admin"]},
    createdAt : {type: Date, default: Date},
    verifyToken: String,
    verifyTokenExpiry: Date,
    resetPassword: String,
    resetPasswordExpiry: Date 
})

export default mongoose.model('User', UserSchema);