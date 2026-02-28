import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, enum: ['Admin', 'Doctor', 'Receptionist', 'Patient'], default: 'Patient' },
    subscriptionPlan: { type: String, enum: ['Free', 'Pro'], default: 'Free' },
    profilePic: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;