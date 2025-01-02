import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import intervueLogo from "../assets/Vector.svg";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function StudentPollView() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newPoll", (poll) => {
      setQuestion(poll);
      setTimeRemaining(poll?.timer || 0);
    });

    const fetchCurrentPoll = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/polls/current");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestion(data);
        setTimeRemaining(data?.timer || 0);
      } catch (error) {
        console.error("Error fetching current poll:", error);
      }
    };

    fetchCurrentPoll();

    socket.on("userKicked", (kickedUserId) => {
      if (socket.id === kickedUserId) {
        localStorage.removeItem("studentName");
        navigate("/kicked-out");
        socket.disconnect();
      }
    });

    let timerInterval;
    if (question && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    } else if (timeRemaining <= 0) {
      console.log("Time is up");
    }

    return () => {
      clearInterval(timerInterval);
      socket.off("newPoll");
      socket.off("userKicked");
    };
  }, [question, timeRemaining, navigate]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      console.log("Submitted answer:", selectedAnswer);
    } else {
      alert("Please select an answer.");
    }
  };

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className=" flex-row px-4 py-1 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-[#F2F2F2] rounded-full text-md font-semibold justify-center items-center">
          <img
            src={intervueLogo}
            alt="React Logo"
            className=" inline-block pr-1"
          />
          Intervue Poll
        </div>
        <div className=" my-9 animate-spin h-12 w-12 mb-6 border-4 border-[#4F0DCE] border-t-transparent rounded-full"></div>
        <p className="text-4xl font-semibold text-gray-900">
          Wait for the teacher to ask questions..
        </p>
      </div>
    );
  }
  else{
  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-8">
      <div className="max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Question 1</h2>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span className="font-medium text-gray-700">
              00:{timeRemaining.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md mb-6">
          <p className="text-lg font-medium text-gray-800 mb-4">
            {question.questionText}
          </p>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(option.text)}
                className={`bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-100 border ${
                  selectedAnswer === option.text
                    ? "border-[#7765DA]"
                    : "border-gray-300"
                }`}
              >
                <span className="mr-2 rounded-full bg-gray-300 px-2 py-1 text-sm">
                  {index + 1}
                </span>
                {option.text}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-8 py-3 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-white font-semibold rounded-full hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedAnswer}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
}

export default StudentPollView;
