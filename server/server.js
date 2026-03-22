const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "AiPrep API is running! 🚀" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/interview", require("./routes/interview"));
app.use("/api/ai", require("./routes/ai"));

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.url} not found` });
});


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected!");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`✅ Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed!", err);
    });