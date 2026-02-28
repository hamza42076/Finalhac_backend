import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true }
});

const prescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicines: [medicineSchema],
    instructions: { type: String }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
