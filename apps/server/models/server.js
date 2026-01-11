// apps/server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const User = require('./models/User');
const Discovery = require('./models/Discovery');
const { generateDiscovery } = require('./agents/agentService'); 

const app = express();
app.use(express.json());
app.use(cors());

/**
 * UPDATED SCOUTING LOGIC
 * This calls the Gemini AI service and saves the result to MongoDB.
 */
const triggerAgentScouting = async (userId, interest) => {
  console.log(`🤖 Agent scouting for: ${interest}...`);
  try {
    // 1. Call the Gemini AI Service
    const match = await generateDiscovery(interest);
    
    // 2. Save result to DB
    if (match) {
      await Discovery.create({
        userId,
        relatedInterest: interest,
        title: match.title,
        description: match.description,
        color: match.color,
        icon: match.icon
      });
      console.log(`✅ Agent successfully found: ${match.title}`);
    }
  } catch (error) {
    console.error("❌ Scouting failed:", error);
  }
};

/**
 * API ROUTES
 */

// 1. Get User Profile & Discoveries
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, interests: [] });
    }

    const discoveries = await Discovery.find({ userId }).sort({ createdAt: -1 });
    res.json({ interests: user.interests, discoveries });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 2. Add Interest (Triggers AI Agent)
app.post('/api/profile/:userId/interest', async (req, res) => {
  try {
    const { userId } = req.params;
    const { interest } = req.body;

    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, interests: [] });
    }
    
    if (!user.interests.includes(interest)) {
      user.interests.push(interest);
      await user.save();
      
      // Fire and forget: don't 'await' so the user gets an instant response
      triggerAgentScouting(userId, interest);
    }

    res.json(user.interests);
  } catch (err) {
    res.status(500).json({ error: "Failed to add interest" });
  }
});

// 3. Remove Interest
app.delete('/api/profile/:userId/interest', async (req, res) => {
  try {
    const { userId } = req.params;
    const { interest } = req.body;

    const user = await User.findOne({ userId });
    if (user) {
      user.interests = user.interests.filter(i => i !== interest);
      await user.save();
      
      // Clean up discoveries related to that interest
      await Discovery.deleteMany({ userId, relatedInterest: interest });
    }

    res.json(user ? user.interests : []);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove interest" });
  }
});

/**
 * SERVER STARTUP
 */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lively_app';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🧠 Gemini AI Agent active`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));