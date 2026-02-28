import express from 'express';
import { upload } from '../Config/cloudinary.js';
import authenticateUser from '../middleware/auth.js';
import Patient from '../Models/Patient.js';

const uploadRoutes = express.Router();

// Upload Medical Report
uploadRoutes.post('/report/:patientId', authenticateUser, upload.single('file'), async (req, res) => {
    try {
        const { patientId } = req.params;
        const fileUrl = req.file.path;
        const fileName = req.body.name || req.file.originalname;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Initialize medicalReports if it doesn't exist
        if (!patient.medicalReports) {
            patient.medicalReports = [];
        }

        patient.medicalReports.push({
            url: fileUrl,
            name: fileName,
            uploadedAt: new Date()
        });

        await patient.save();

        res.status(200).json({
            message: 'File uploaded successfully',
            data: { url: fileUrl, name: fileName }
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// Standalone Profile Picture Upload
uploadRoutes.post('/profile-pic', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer Middleware Error:', err);
            return res.status(500).json({ message: 'Multer Error', error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log("Profile Pic Upload Request Received");
        if (!req.file) {
            console.log("No file in request");
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log("File uploaded to:", req.file.path);
        res.status(200).json({
            message: 'Profile picture uploaded successfully',
            url: req.file.path
        });
    } catch (error) {
        console.error('Profile Pic Route Error:', error);
        res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
    }
});

export default uploadRoutes;
