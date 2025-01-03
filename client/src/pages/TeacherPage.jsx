import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/Vector.svg";
import axios from "axios";

function TeacherPage() {
  const [text, setText] = useState("");
  const [selectedTimer, setSelectedTimer] = useState("30 seconds");
  const [options, setOptions] = useState([
    { id: 1, text: "", correct: "no" },
    { id: 2, text: "", correct: "no" }
  ]);

  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTimerChange = (e) => {
    setSelectedTimer(e.target.value);
  };

  const handleOptionChange = (id, newText) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, text: newText } : option
      )
    );
  };

  const handleCorrectChange = (id, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, correct: value } : option
      )
    );
  };

  const handleAddOption = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { id: prevOptions.length + 1, text: "", correct: "no" }
    ]);
  };

  const handleSubmit = async () => {
    const pollData = {
      question: text,
      options: options.map((option) => option.text),
      timer: parseInt(selectedTimer.split(" ")[0]),
      status: "active"
    };

    try {
      const response = await axios.post("https://live-polling-backend-puce.vercel.app/api/polls", pollData);
      console.log("Poll submitted successfully:", response.data);
      navigate(`/result/${response.data.id}`);
    } catch (error) {
      console.error("Error submitting poll:", error.response?.data || error.message);
      alert("Failed to submit poll. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="bg-white p-8 max-w-4xl text-center">
        <div className="flex mb-6">
          <div className="flex flex-row px-4 py-1 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-[#F2F2F2] rounded-full text-md font-semibold justify-center items-center">
            <img src={reactLogo} alt="React Logo" className="inline-block pr-1" />
            Intervue Poll
          </div>
        </div>
        <h1 className="flex text-3xl font-semibold text-gray-800 mb-4">
          Let’s <span className="text-black font-bold">Get Started</span>
        </h1>
        <p className="text-gray-500 mb-8">
          You’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
        <div className="mb-8">
          <div className="flex flex-row justify-between">
            <label className="block text-left text-lg font-bold text-gray-700 mb-2">
              Enter your question
            </label>
            <select
              value={selectedTimer}
              onChange={handleTimerChange}
              className="border-2 rounded-lg text-center p-2 bg-white text-gray-700 focus:outline-none focus:border-[#7765DA]"
            >
              <option value="30 seconds">30 seconds</option>
              <option value="60 seconds">60 seconds</option>
            </select>
          </div>

          <div className="flex font-medium items-center">
            <textarea
              className="w-full border-2 rounded-lg p-4 text-gray-700 focus:outline-none focus:border-[#7765DA] bg-gray-100 resize-none"
              rows="5"
              value={text}
              onChange={handleTextChange}
              placeholder="Type your question here..."
              maxLength={100}
            ></textarea>
          </div>
          <div className="text-right text-gray-400 text-sm mt-1">
            {text.length}/100
          </div>
        </div>
        <div className="mb-8">
          <div className="flex flex-row justify-between">
            <label className="block text-left text-lg font-bold text-gray-700 mb-4">
              Edit Options
            </label>
            <label className="block text-left text-lg font-bold text-gray-700 mb-4 mr-5">
              Is it Correct?
            </label>
          </div>
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center justify-evenly rounded-lg pl-0 mb-4"
            >
              <span className="w-6 h-6 flex items-center justify-center m-0 bg-[#4F0DCE] text-white rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex items-center flex-1 bg-gray-100 rounded-md mx-4 p-4">
                <input
                  type="text"
                  className="flex-1 font-medium border-none bg-transparent text-gray-700 focus:outline-none"
                  placeholder="Enter option text..."
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                />
              </div>
              <div className="flex font-medium items-center gap-4">
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    value="yes"
                    className="mr-2 accent-[#7765DA]"
                    checked={option.correct === "yes"}
                    onChange={() => handleCorrectChange(option.id, "yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    value="no"
                    className="mr-2 accent-[#7765DA]"
                    checked={option.correct === "no"}
                    onChange={() => handleCorrectChange(option.id, "no")}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="flex ml-10 mt-4 px-4 py-2 border rounded-lg text-[#7765DA] border-[#7765DA] font-medium hover:bg-gray-100 transition"
          >
            + Add More Option
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="px-8 py-3 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-white font-semibold rounded-full hover:shadow-md transition"
            onClick={handleSubmit}
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherPage;
