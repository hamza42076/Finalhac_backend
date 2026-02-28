import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contact: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicalReports: [{
        url: { type: String, required: true },
        name: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
