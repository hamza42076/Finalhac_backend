import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "./Models/User.js";

const seedUsers = async () => {
    try {
        // 1. Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully!");

        // 2. Clear existing users (Optional: Remove if you don't want to clear)
        console.log("Clearing existing users...");
        await User.deleteMany({});

        // 3. Define default users
        const passwordHash = await bcrypt.hash("password123", 10);

        const users = [
            {
                name: "Admin User",
                email: "admin@clinic.com",
                password: passwordHash,
                role: "Admin",
                subscriptionPlan: "Pro"
            },
            {
                name: "Doctor Smith",
                email: "doctor@clinic.com",
                password: passwordHash,
                role: "Doctor",
                subscriptionPlan: "Pro"
            },
            {
                name: "Receptionist Jane",
                email: "receptionist@clinic.com",
                password: passwordHash,
                role: "Receptionist",
                subscriptionPlan: "Free"
            },
            {
                name: "Patient Doe",
                email: "patient@clinic.com",
                password: passwordHash,
                role: "Patient",
                subscriptionPlan: "Free"
            }
        ];

        // 4. Insert users
        console.log("Seeding users...");
        await User.insertMany(users);
        console.log("Database seeded successfully!");

        // 5. Close connection
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedUsers();
