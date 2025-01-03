import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import timerIcon from "../assets/timer.svg";

function StudentPoll() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get("https://live-polling-backend-puce.vercel.app/api/polls/active");
        setQuestion(response.data);
        setTimeLeft(response.data.timer);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching the question:", err);
        setError("Failed to load the question.");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval); 
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && question) {
      alert("Time's up!");
      navigate(`/result/${question._id}`);
    }
  }, [timeLeft, question, navigate]);

  const handleSubmit = async () => {
    if (!question || !selectedAnswer) return;

    try {
      await axios.post(`https://live-polling-backend-puce.vercel.app/api/polls/${question._id}/submit`, {
        studentName: "Student1",
        answer: selectedAnswer,
      });
      alert("Response submitted successfully!");
      navigate(`/result/${question._id}`);
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Failed to submit your response. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading question...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!question) {
    return <div>No active question available.</div>;
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Question</h2>
        <div className="bg-white px-4 py-2 rounded">
          <img src={timerIcon} alt="timer" className="inline-block pr-1" />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="bg-white border-gray-800 rounded-lg p-8 shadow-md">
        <div className="bg-gradient-to-r from-[#373737] to-[#6E6E6E] rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {question.question}
          </h3>
        </div>
        <div className="flex flex-col gap-4 my-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`flex items-center gap-4 p-4 border-2 rounded-lg text-left transition-all
                ${
                  selectedAnswer === option
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-600 hover:border-primary"
                }`}
              onClick={() => setSelectedAnswer(option)}
            >
              <span
                className={`flex w-6 h-6 items-center justify-center m-0 bg-[#4F0DCE] text-white rounded-full text-sm font-semibold
                ${
                  selectedAnswer === option
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </span>
              {option}
            </button>
          ))}
        </div>

        <button
          className="w-1/4 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] py-4 px-8 rounded-full font-semibold text-white transition-colors
            disabled:bg-gray-400 disabled:cursor-not-allowed
            bg-primary hover:bg-primary-dark"
          onClick={handleSubmit}
          disabled={!selectedAnswer}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default StudentPoll;
