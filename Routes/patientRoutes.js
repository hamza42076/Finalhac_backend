import express from "express";
import Patient from "../Models/Patient.js";
import authenticateUser from "../middleware/auth.js";

const patientRoutes = express.Router();

// Apply authentication middleware to all patient routes
patientRoutes.use(authenticateUser);

// Get all patients
patientRoutes.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ data: patients, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Get a patient by ID
patientRoutes.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found", status: 404 });
        res.status(200).json({ data: patient, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Create a new patient
patientRoutes.post("/", async (req, res) => {
    try {
        const { name, age, gender, contact } = req.body;

        if (!name || !age || !gender || !contact) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }

        const newPatient = new Patient({
            name,
            age,
            gender,
            contact,
            createdBy: req.user._id // assuming authenticateUser middleware sets req.user
        });

        await newPatient.save();
        res.status(201).json({ message: "Patient created successfully", data: newPatient, status: 201 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Update a patient
patientRoutes.put("/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: "Patient not found", status: 404 });
        res.status(200).json({ message: "Patient updated successfully", data: patient, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Delete a patient
patientRoutes.delete("/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found", status: 404 });
        res.status(200).json({ message: "Patient deleted successfully", status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

export default patientRoutes;
