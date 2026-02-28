import express from "express";
import Prescription from "../Models/Prescription.js";
import authenticateUser from "../middleware/auth.js";

const prescriptionRoutes = express.Router();

// Apply authentication middleware to all routes
prescriptionRoutes.use(authenticateUser);

// Get timeline/history for a specific patient
prescriptionRoutes.get("/patient/:patientId", async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientId: req.params.patientId })
            .populate('patientId', 'name age contact')
            .populate('doctorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ data: prescriptions, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Add a new prescription
prescriptionRoutes.post("/", async (req, res) => {
    try {
        // Enforce doctor role
        if (req.user.role !== 'Doctor' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Forbidden: Only Doctors can write prescriptions", status: 403 });
        }

        const { patientId, medicines, instructions } = req.body;

        if (!patientId || !medicines || !Array.isArray(medicines)) {
            return res.status(400).json({ message: "Patient ID and medicines array are required", status: 400 });
        }

        const newPrescription = new Prescription({
            patientId,
            doctorId: req.user._id,
            medicines,
            instructions
        });

        await newPrescription.save();
        res.status(201).json({ message: "Prescription created successfully", data: newPrescription, status: 201 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

export default prescriptionRoutes;
