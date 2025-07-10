const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client, Users } = require("node-appwrite");

const app = express();
const PORT = 3000; // Change as needed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Appwrite Admin Client
const client = new Client()
  .setEndpoint("http://89.116.21.143/v1") // e.g. https://cloud.appwrite.io/v1
  .setProject("68492a7c0008fcc0cbc2")               // Your Appwrite project ID
  .setKey("standard_075c52611a9f1b42bff0e7e4f7dbb16db45ddd326f1da5b0783cbd2eda06eb9e0655155260b11d6ed1945b279d002121d5ecba2817eafc5f0cba088c8e786bb0c43b2be9b6691d0a1d5421a66b1471cf03c6331ecbc61aa784831dd29a14041e95c35d5217421ed9d264f7260394dc92509d3b20fcb6bffa28f13711e7735c3d");               // Your Admin API key (server key only)

const users = new Users(client);

// 🔐 Optional admin secret for extra protection
const ADMIN_SECRET = "bablu4545"; // optional (pass from Flutter)

// Route: Delete user
app.post("/delete-user", async (req, res) => {
  console.log("📦 Incoming body:", req.body); // ✅ Debug

  const { userId, secret } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  // Optional: Check secret
  if (ADMIN_SECRET && secret !== ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    await users.delete(userId);
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
