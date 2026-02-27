import express from "express";
import authRoutes from "./Routes/authRoutes.js";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors"

const PORT = 3000;


const app = express();


app.use(express.json());
app.use(cors())
app.use("/auth", authRoutes);

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