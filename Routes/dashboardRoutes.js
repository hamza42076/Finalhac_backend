import express from "express";
import authenticateUser from "../middleware/auth.js";
import Patient from "../Models/Patient.js";
import Appointment from "../Models/Appointment.js";
import Prescription from "../Models/Prescription.js";

const dashboardRoutes = express.Router();
dashboardRoutes.use(authenticateUser);

dashboardRoutes.get("/stats", async (req, res) => {
    try {
        const role = req.user.role;
        let stats = {};

        if (role === 'Admin' || role === 'Receptionist') {
            const totalPatients = await Patient.countDocuments();
            const totalAppointments = await Appointment.countDocuments();
            const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

            // Mock chart data for last 7 days since DB is empty
            const chartData = [
                { name: 'Mon', appointments: 4, revenue: 1200 },
                { name: 'Tue', appointments: 7, revenue: 2100 },
                { name: 'Wed', appointments: 3, revenue: 900 },
                { name: 'Thu', appointments: 8, revenue: 2400 },
                { name: 'Fri', appointments: 5, revenue: 1500 },
                { name: 'Sat', appointments: 2, revenue: 600 },
            ];

            stats = {
                cardData: { totalPatients, totalAppointments, pendingAppointments },
                chartData
            };
        } else if (role === 'Doctor') {
            const doctorId = req.user._id;
            const myAppointments = await Appointment.countDocuments({ doctorId });
            const myPrescriptions = await Prescription.countDocuments({ doctorId });
            const pending = await Appointment.countDocuments({ doctorId, status: 'Pending' });

            // Mock chart data 
            const chartData = [
                { name: 'Mon', patientsSeen: 3 },
                { name: 'Tue', patientsSeen: 5 },
                { name: 'Wed', patientsSeen: 2 },
                { name: 'Thu', patientsSeen: 6 },
                { name: 'Fri', patientsSeen: 4 },
                { name: 'Sat', patientsSeen: 1 },
            ];

            stats = {
                cardData: { myAppointments, myPrescriptions, pending },
                chartData
            };
        } else {
            // Patient
            // Ideally map using linked patientId, sending mock info for now
            stats = {
                cardData: { message: "Welcome Passenger" },
                chartData: []
            };
        }

        res.status(200).json({ data: stats, status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching stats" });
    }
});

export default dashboardRoutes;
