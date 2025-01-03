import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Result() {
  const [question, setQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const pollResponse = await axios.get(`https://live-polling-backend-puce.vercel.app/api/polls/${id}`);
        setQuestion(pollResponse.data);

        const response = await axios.get(`https://live-polling-backend-puce.vercel.app/api/polls/${id}/results`);
        setResponses(response.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load the results.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return <div>Loading results...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!question) {
    return <div>No question data available.</div>;
  }

  const totalVotes = responses.reduce((sum, option) => sum + option.count, 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Question</h2>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md">
      <div className="bg-gradient-to-r from-[#373737] to-[#6E6E6E] rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {question.question}
          </h3>
        </div>

        <div className="flex flex-col gap-4 my-8">
          {responses.map((option, index) => {
            const percentage = totalVotes > 0 ? ((option.count / totalVotes) * 100).toFixed(2) : 0;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-2 rounded-lg text-left relative"
              >
                <span className="w-6 h-6 flex items-center justify-center m-0 bg-[#4F0DCE] text-white rounded-full text-sm font-semibold">
                {index + 1}
              </span>
                <span className="flex-grow">{option.option}</span>
                <div
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  style={{ width: `${percentage}%` }}
                />
                <span className="ml-2 text-sm font-bold text-black">{percentage}%</span>
              </div>
            );
          })}
        </div>
        

        {totalVotes === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No responses yet.
          </p>
        )}
      </div>
      
    </div>
  );
}

export default Result;
