import express from "express";
import cors from "cors";
import sqlite from "better-sqlite3";
import path from "path";

const app = express();

const dbPath = path.resolve("./data/main.db");

const db = sqlite(dbPath, { verbose: console.log });

const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// Route to fetch all devices
app.get("/devices", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM devices").all();
    res.status(200).json({ devices: rows });
  } catch (err) {
    console.error("Error fetching devices:", err);
    res.status(500).json({ error: "Failed to fetch devices." });
  }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
