import React, { useState } from "react";
import intervueLogo from "../assets/Vector.svg";
import { useNavigate } from "react-router-dom";

function StudentPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleContinue = () => {
    
      navigate("/studentpoll", { state: { name } });
    
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="bg-white p-8 max-w-xl text-center">
        <div className="flex mb-6 justify-center items-center">
          <div className="flex-row px-4 py-1 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-[#F2F2F2] rounded-full text-md font-semibold justify-center items-center">
            <img
              src={intervueLogo}
              alt="React Logo"
              className="inline-block pr-1"
            />
            Intervue Poll
          </div>
        </div>
        <h1 className="flex items-center justify-center text-3xl font-semibold text-gray-800 mb-4">
          Let’s <span className="text-black font-bold">Get Started</span>
        </h1>
        <p className="text-gray-500 mb-8">
          If you're a student, you'll be able to{" "}
          <span className="text-black font-bold">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates.
        </p>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-left text-lg font-medium text-gray-700 mb-2"
          >
            Enter your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7765DA] bg-gray-100"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <button
          onClick={handleContinue}
          className="w-1/2 mt-4 px-8 py-3 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-white font-semibold rounded-full hover:shadow-md transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default StudentPage;
