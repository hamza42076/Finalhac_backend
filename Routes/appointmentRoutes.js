import express from "express";
import Appointment from "../Models/Appointment.js";
import authenticateUser from "../middleware/auth.js";

const appointmentRoutes = express.Router();

// Apply authentication middleware to all routes
appointmentRoutes.use(authenticateUser);

// Get appointments based on role
appointmentRoutes.get("/", async (req, res) => {
    try {
        let filter = {};
        const userRole = req.user.role;

        // Only fetch related appointments based on role
        if (userRole === "Patient") {
            // Need a way to map user account to patientId eventually, 
            // but for now, they might just send it as a query param if they have multiple profiles linked
            // Or we check createdBy
        } else if (userRole === "Doctor") {
            filter.doctorId = req.user._id;
        }
        // Admin & Receptionist see everything, so filter remains empty.

        // Allow fetching by query string too
        if (req.query.doctorId) filter.doctorId = req.query.doctorId;
        if (req.query.patientId) filter.patientId = req.query.patientId;
        if (req.query.status) filter.status = req.query.status;

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'name age contact')
            .populate('doctorId', 'name email');

        res.status(200).json({ data: appointments, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Book an appointment
appointmentRoutes.post("/", async (req, res) => {
    try {
        const { patientId, doctorId, date } = req.body;

        if (!patientId || !doctorId || !date) {
            return res.status(400).json({ message: "Patient, Doctor, and Date are required", status: 400 });
        }

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", data: newAppointment, status: 201 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

// Update appointment status or date
appointmentRoutes.put("/:id", async (req, res) => {
    try {
        const { status, date } = req.body;
        let updateData = {};
        if (status) updateData.status = status;
        if (date) updateData.date = date;

        const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!appointment) return res.status(404).json({ message: "Appointment not found", status: 404 });

        res.status(200).json({ message: "Appointment updated successfully", data: appointment, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

export default appointmentRoutes;
