import express from "express";
import authRoutes from "./Routes/authRoutes.js";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors"
import patientRoutes from "./Routes/patientRoutes.js";
import appointmentRoutes from "./Routes/appointmentRoutes.js";
import prescriptionRoutes from "./Routes/prescriptionRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

const PORT = 3000;
const app = express();


app.use(express.json());
app.use(cors())
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/ai", aiRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connect MongoDB");
}).catch((err => console.log("Could not to connect mongoDB", err)
))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});