import express from "express";
import cors from "cors";
import sqlite from "better-sqlite3";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
app.use(express.json());

const dbPath = path.resolve("./data/main.db");
const db = sqlite(dbPath, { verbose: console.log });

app.use(cors({ origin: "*" }));

// Create an HTTP server
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

const broadcastDevicesUpdate = () => {
  console.log("Broadcasting devices update.");
  const devices = db.prepare("SELECT * FROM devices").all();
  const data = JSON.stringify({ type: "devices_update", data: devices });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // Use WebSocket.OPEN
      client.send(data);
    }
  });
};

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established.");

  // Send the current devices data to the newly connected client
  const devices = db.prepare("SELECT * FROM devices").all();
  ws.send(JSON.stringify({ type: "devices_update", data: devices }));

  // Handle WebSocket close
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

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

app.get("/devices/:uid", (req, res) => {
  const { uid } = req.params;

  try {
    const stmt = db.prepare("SELECT * FROM devices WHERE UID = ?");
    const device = stmt.get(uid); // Get a single row

    if (!device) {
      return res.status(404).json({ error: "Device not found." });
    }

    res.status(200).json(device);
  } catch (err) {
    console.error("Error fetching device:", err);
    res.status(500).json({ error: "Failed to fetch device." });
  }
});

// Route to update a device by uid
app.put("/devices/:uid", (req, res) => {
  const { uid } = req.params;
  const updates = req.body;

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
      // Broadcast the updated devices data to all WebSocket clients
      broadcastDevicesUpdate();
      res.status(200).json({ message: "Device updated successfully." });
    } else {
      res.status(404).json({ error: "Device not found." });
    }
  } catch (err) {
    console.error("Error updating device:", err);
    res.status(500).json({ error: "Failed to update device." });
  }
});

// Route to fetch data log by UID
app.get("/datalog", (req, res) => {
  const { UID, startDate, limit } = req.query;

  // Check for missing UID
  if (!UID) {
    return res.status(400).json({ error: "Missing UID parameter." });
  }

  try {
    const dateFilter = startDate ? new Date(startDate) : new Date();

    // Check if the startDate is valid
    if (isNaN(dateFilter.getTime())) {
      return res.status(400).json({ error: "Invalid startDate format." });
    }

    const formattedDate = dateFilter.toISOString().split("T")[0];

    // Validate and set the LIMIT parameter (default to 28 if not provided)
    const limitValue = limit && !isNaN(limit) ? parseInt(limit) : 28;

    const stmt = db.prepare(`
      SELECT 
        DATE(timestamp) AS date, 
        soilMoisture,
        tankLevel,
        batLevel,
        pumpActive
      FROM datalog
      WHERE UID = ? AND DATE(timestamp) <= ?
      GROUP BY date
      ORDER BY date DESC
      LIMIT ?
    `);

    // Execute query with the limit parameter
    const rows = stmt.all(UID, formattedDate, limitValue);

    // If no data found
    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found for this UID." });
    }

    console.log("Fetched Data:", rows); // Debugging
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching data log:", err);
    res.status(500).json({ error: "Failed to fetch data log." });
  }
});

app.get("/datalogRolling", (req, res) => {
  const { UID } = req.query;

  if (!UID) {
    return res.status(400).json({ error: "Missing UID parameter." });
  }

  try {
    const stmt = db.prepare(
      "SELECT timestamp, batLevel, tankLevel, soilMoisture, pumpActive FROM datalogRolling WHERE UID = ? ORDER BY timestamp DESC LIMIT 1"
    );
    const row = stmt.get(UID);

    if (!row) {
      return res.status(404).json({ error: "No data found for this UID." });
    }

    res.status(200).json(row);
  } catch (err) {
    console.error("Error fetching latest data log:", err);
    res.status(500).json({ error: "Failed to fetch data log." });
  }
});

// Route to append a new entry to the datalog table and update the devices table
app.post("/datalog", (req, res) => {
  let { UID, batLevel, tankLevel, soilMoisture, pumpActive } = req.body;

  // Ensure required fields exist
  if (
    !UID ||
    batLevel === undefined ||
    tankLevel === undefined ||
    soilMoisture === undefined ||
    pumpActive === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Explicitly cast values to proper types
  batLevel = Number(batLevel);
  tankLevel = Number(tankLevel);
  soilMoisture = Number(soilMoisture);
  pumpActive = pumpActive ? 1 : 0; // Convert boolean to 0/1

  try {
    // Insert into datalog (timestamp auto-generated)
    const insertStmt = db.prepare(
      "INSERT INTO datalog (UID, batLevel, tankLevel, soilMoisture, pumpActive) VALUES (?, ?, ?, ?, ?)"
    );
    insertStmt.run(UID, batLevel, tankLevel, soilMoisture, pumpActive);

    // Update devices table
    const updateStmt = db.prepare("UPDATE devices SET batLevel = ?, tankLevel = ?, soilMoisture = ? WHERE UID = ?");
    updateStmt.run(batLevel, tankLevel, soilMoisture, UID);

    res.status(201).json({ message: "Data log entry added and device updated successfully." });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
});

app.post("/datalogRolling", (req, res) => {
  let { UID, batLevel, tankLevel, soilMoisture, pumpActive } = req.body;

  // Ensure required fields exist
  if (
    !UID ||
    batLevel === undefined ||
    tankLevel === undefined ||
    soilMoisture === undefined ||
    pumpActive === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Explicitly cast values to proper types
  batLevel = Number(batLevel);
  tankLevel = Number(tankLevel);
  soilMoisture = Number(soilMoisture);
  pumpActive = pumpActive ? 1 : 0; // Convert boolean to 0/1

  try {
    // Insert into datalog (timestamp auto-generated)
    const insertStmt = db.prepare(
      "INSERT INTO datalogRolling (UID, batLevel, tankLevel, soilMoisture, pumpActive) VALUES (?, ?, ?, ?, ?)"
    );
    insertStmt.run(UID, batLevel, tankLevel, soilMoisture, pumpActive);

    // Update devices table
    const updateStmt = db.prepare(
      "UPDATE devices SET batLevel = ?, tankLevel = ?, soilMoisture = ?, timestamp = CURRENT_TIMESTAMP WHERE UID = ?"
    );
    updateStmt.run(batLevel, tankLevel, soilMoisture, UID);

    res.status(201).json({ message: "Data log entry added and device updated successfully." });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
});
