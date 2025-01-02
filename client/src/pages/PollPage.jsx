import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function PollPage() {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { pollId } = location.state || {};

  useEffect(() => {
    if (pollId) {
      axios
        .get(`/api/polls/${pollId}`)
        .then((response) => {
          const data = response.data;
          setPoll(data);
          setTimer(data.timer);
        })
        .catch((error) => {
          console.error("Error fetching poll data:", error);
        });
    }
  }, [pollId]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      alert("Time's up!");
      handleSubmit();
    }
  }, [timer]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option!");
      return;
    }

    axios
      .post(`/api/polls/${pollId}/submit`, { selectedOption })
      .then(() => {
        alert("Response submitted successfully!");
        navigate("/thank-you");
      })
      .catch((error) => {
        console.error("Error submitting response:", error);
      });
  };

  if (!poll) {
    return <div>Loading poll...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Question 1</h2>
          <div className="text-red-500 font-bold text-sm">
            ⏱ {timer < 10 ? `0${timer}` : timer} seconds
          </div>
        </div>
        <div className="text-gray-800 text-lg font-medium mb-4">
          {poll.question}
        </div>
        <div>
          {poll.options.map((option, index) => (
            <div
              key={index}
              className={`p-3 mb-2 border rounded-lg cursor-pointer ${
                selectedOption === index
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300"
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <span className="font-bold">{index + 1}. </span>
              {option}
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default PollPage;
