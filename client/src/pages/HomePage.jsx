import React from "react";
import reactLogo from "../assets/Vector.svg";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="bg-white p-8 max-w-2xl text-center">
        <div className="flex mb-6 justify-center items-center">
          <div className="flex-row px-4 py-1 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-[#F2F2F2] rounded-full text-md font-semibold justify-center items-center">
            <img
              src={reactLogo}
              alt="React Logo"
              className="inline-block pr-1"
            />
            Intervue Poll
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome to the <span className="text-black font-bold">Live Polling System</span>
        </h1>
        <p className="text-gray-500 mb-8">
          Please select the role that best describes you to begin using the live polling system.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/student">
            <div className="border-4 rounded-lg p-4 cursor-pointer text-left hover:border-[#7765DA]">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                I’m a Student
              </h2>
              <p className="text-sm text-gray-500">
                Participate in live polls and see how your responses compare with classmates.
              </p>
            </div>
          </Link>
          <Link to="/teacher">
            <div className="border-4 rounded-lg p-4 cursor-pointer text-left hover:border-[#7765DA]">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                I’m a Teacher
              </h2>
              <p className="text-sm text-gray-500">
                Submit answers and view live poll results in real-time.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;