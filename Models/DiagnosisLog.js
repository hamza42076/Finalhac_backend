import mongoose from "mongoose";

const diagnosisLogSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: [{ type: String }],
    aiResponse: { type: String, required: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Unknown'], default: 'Unknown' }
}, { timestamps: true });

export default mongoose.model("DiagnosisLog", diagnosisLogSchema);
