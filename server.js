const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/snakeGameDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define a Score model
const scoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", scoreSchema);

// Set up the static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint to add a new score
app.post("/api/scores", async (req, res) => {
  const { player, score } = req.body;

  try {
    const newScore = new Score({ player, score });
    await newScore.save();
    res.status(201).send(newScore);
  } catch (error) {
    res.status(400).send("Error saving score");
  }
});

// Endpoint to get all scores
app.get("/api/scores", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.status(200).send(scores);
  } catch (error) {
    res.status(400).send("Error fetching scores");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
