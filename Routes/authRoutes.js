import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import authenticateUser from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.get("/me", authenticateUser, (req, res) => {
    try {
        res.json({
            message: "User fetched successfully",
            data: req.user,
            status: 200
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

authRoutes.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password fields are required", status: 400 });
        }
        if (name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long", status: 400 });
        }
        if (!email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email", status: 400 });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long", status: 400 });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists", status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS));
        console.log(hashedPassword);

        const validRoles = ['Admin', 'Doctor', 'Receptionist', 'Patient'];
        const userRole = validRoles.includes(role) ? role : 'Patient';

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            profilePic: req.body.profilePic || ''
        });
        await newUser.save();
        const createToken = jwt.sign({
            id: newUser._id,
            role: newUser.role
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(201).json({
            message: "Register successfully",
            data: {
                name: newUser.name,
                email: newUser.email,
                id: newUser._id,
                role: newUser.role,
                token: createToken
            },
            status: 200
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

authRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }
        if (!email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email", status: 400 });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long", status: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", status: 400 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password", status: 400 });
        }
        const createToken = jwt.sign({
            id: user._id,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({
            message: "Login successfully",
            data: {
                name: user.name,
                email: user.email,
                id: user._id,
                role: user.role,
                token: createToken
            },
            status: 200
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

authRoutes.put("/update-profile", authenticateUser, async (req, res) => {
    try {
        const { name, profilePic } = req.body;
        const userId = req.user.id; // From authenticateUser middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        if (name) user.name = name;
        if (profilePic !== undefined) user.profilePic = profilePic;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            data: {
                name: user.name,
                email: user.email,
                id: user._id,
                role: user.role,
                profilePic: user.profilePic,
                subscriptionPlan: user.subscriptionPlan
            },
            status: 200
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
});

export default authRoutes;