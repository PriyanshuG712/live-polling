const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    timer: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  },
  { timestamps: true } // This will add `createdAt` and `updatedAt` fields
);

const responseSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  optionCounts: [
    {
      option: String, // Text of the option
      count: { type: Number, default: 0 }, // Number of times chosen
    },
  ],
});

const Poll = mongoose.model("Poll", pollSchema);
const Response = mongoose.model("Response", responseSchema);

app.post("/api/polls", async (req, res) => {
  try {
    const { question, options, timer } = req.body;

    if (!question || !options || options.length < 2 || !timer) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const poll = new Poll({ question, options, timer, status: "active" });
    await poll.save();

    // Initialize the response document
    const response = new Response({
      pollId: poll._id,
      optionCounts: options.map((option) => ({ option, count: 0 })),
    });
    await response.save();

    io.emit("newPoll", poll);
    res.status(201).json({ id: poll._id, message: "Poll created successfully" });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/polls/active", async (req, res) => {
  try {
    const activePoll = await Poll.findOne({ status: "active" })
      .sort({ createdAt: -1 })
      .exec();
    if (!activePoll) {
      return res.status(404).json({ error: "No active poll found" });
    }
    res.json(activePoll);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the active poll" });
  }
});

app.get("/api/polls/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/polls/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, answer } = req.body;

    // Validate request body
    if (!answer) {
      return res.status(400).json({ error: "Missing student name or answer" });
    }

    // Find the poll and check if it's active
    const poll = await Poll.findById(id);
    if (!poll || poll.status !== "active") {
      return res.status(404).json({ error: "Poll not found or inactive" });
    }

    // Validate the answer against poll options
    if (!poll.options.includes(answer)) {
      return res.status(400).json({ error: "Invalid answer option" });
    }

    // Find the corresponding response document
    const response = await Response.findOne({ pollId: id });
    if (!response) {
      return res.status(404).json({ error: "Response document not found" });
    }

    // Increment the count for the selected option
    const optionIndex = response.optionCounts.findIndex((opt) => opt.option === answer);
    if (optionIndex === -1) {
      return res.status(400).json({ error: "Invalid answer" });
    }

    response.optionCounts[optionIndex].count += 1;
    await response.save();

    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/polls/:id/results", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Response.findOne({ pollId: id });
    if (!response) {
      return res.status(404).json({ error: "No responses found for this poll" });
    }

    res.status(200).json(response.optionCounts);
  } catch (error) {
    console.error("Error fetching poll results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;