const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/pollDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  timer: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
});

const responseSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  studentName: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Poll = mongoose.model("Poll", pollSchema);
const Response = mongoose.model("Response", responseSchema);

app.post("/api/polls", async (req, res) => {
  try {
    const { question, options, timer } = req.body;

    if (!question || !options || options.length < 2 || !timer) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const poll = new Poll({
      question,
      options,
      timer,
      status: "active",
    });

    await poll.save();
    io.emit("newPoll", poll);
    res.status(201).json({ id: poll._id, message: "Poll created successfully" });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/polls/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, answer } = req.body;

    if (!studentName || !answer) {
      return res.status(400).json({ error: "Missing student name or answer" });
    }

    const poll = await Poll.findById(id);
    if (!poll || poll.status !== "active") {
      return res.status(404).json({ error: "Poll not found or inactive" });
    }

    const response = new Response({
      pollId: id,
      studentName,
      answer,
    });
    await response.save();

    const responses = await Response.find({ pollId: id });
    io.emit("pollResults", { pollId: id, responses });

    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/polls/:id/results", async (req, res) => {
  try {
    const { id } = req.params;

    const responses = await Response.find({ pollId: id });
    if (!responses.length) {
      return res.status(404).json({ error: "No responses found for this poll" });
    }

    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching poll results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
