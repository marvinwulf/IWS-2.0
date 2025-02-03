import express from "express";
import cors from "cors";
import sqlite from "better-sqlite3";
import path from "path";

const app = express();
app.use(express.json()); // Middleware to parse JSON body

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

// Route to update a device by uid
app.put("/devices/:uid", (req, res) => {
  const { uid } = req.params;
  const updates = req.body; // Fields to update

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No update fields provided." });
  }

  const columns = Object.keys(updates)
    .map((key) => `${key} = @${key}`)
    .join(", ");
  const sql = `UPDATE devices SET ${columns} WHERE UID = @uid`;

  try {
    const stmt = db.prepare(sql);
    const result = stmt.run({ ...updates, uid });

    if (result.changes > 0) {
      res.status(200).json({ message: "Device updated successfully." });
    } else {
      res.status(404).json({ error: "Device not found." });
    }
  } catch (err) {
    console.error("Error updating device:", err);
    res.status(500).json({ error: "Failed to update device." });
  }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
