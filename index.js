const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client, Users, Databases, Query } = require("node-appwrite");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Appwrite Admin Client
const client = new Client()
    .setEndpoint("http://89.116.21.143/v1")
    .setProject("68492a7c0008fcc0cbc2")
    .setKey("standard_075c52611a9f1b42bff0e7e4f7dbb16db45ddd326f1da5b0783cbd2eda06eb9e0655155260b11d6ed1945b279d002121d5ecba2817eafc5f0cba088c8e786bb0c43b2be9b6691d0a1d5421a66b1471cf03c6331ecbc61aa784831dd29a14041e95c35d5217421ed9d264f7260394dc92509d3b20fcb6bffa28f13711e7735c3d"); // Use your real key

const users = new Users(client);
const databases = new Databases(client);

// 🔐 Optional admin secret
const ADMIN_SECRET = "bablu4545";

// Constants - replace with your actual values
const DATABASE_ID = "684944c10013057eb14a";
const COLLECTION_ID = "684944d1001f0244569e";

// Route: Delete user
app.post("/delete-user", async (req, res) => {
    console.log("📦 Incoming body:", req.body);

    const { userId, secret } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Missing userId" });
    }

    if (ADMIN_SECRET && secret !== ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    try {
        // Delete user-related documents
        const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("userId", userId)
        ]);

        for (const doc of docs.documents) {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
        }

        // Delete Appwrite user
        await users.delete(userId);

        return res.json({ success: true, message: "User and documents deleted successfully" });

    } catch (error) {
        console.error("❌ Deletion error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
