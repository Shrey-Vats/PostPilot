import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    passowrd: {type: String, required: true},
    role: {type: String, default: "user", enum: ["user", "admin"]},
    createdAt : {type: Date, default: Date} 
})

export default mongoose.model('User', UserSchema);