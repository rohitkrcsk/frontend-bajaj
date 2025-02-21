import { useState } from "react";
import axios from "axios";

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
  [key: string]: string | string[] | boolean;
}

export default function Home() {
  const [inputData, setInputData] = useState("");
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "https://bajaj-seven-jet.vercel.app/bfhl"; // Replace with your backend URL

  // Handle API Request
  const handleSubmit = async () => {
    try {
      setError(null);
      const parsedData = JSON.parse(inputData);

      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format. Must contain a 'data' array.");
      }

      const response = await axios.post<ApiResponse>(API_URL, parsedData);
      setResponseData(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setResponseData(null);
    }
  };

  // Handle Multi-Select Change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedFilters(options);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          🚀 BFHL Data Processor
        </h1>

        {/* Textarea Input */}
        <label className="block text-gray-700 font-semibold mb-2">Enter JSON:</label>
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
          placeholder='e.g. { "data": ["A", "1", "B"] }'
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105"
        >
          🔥 Process Data
        </button>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-600 font-semibold bg-red-100 p-2 rounded-lg text-center">
            ❌ {error}
          </p>
        )}

        {/* Response Section */}
        {responseData && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border shadow-md">
            <h2 className="text-lg font-bold mb-3 text-gray-700">📌 Select Data to Display:</h2>

            {/* Multi-Select Dropdown */}
            <select
              multiple
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-400"
            >
              {Object.keys(responseData).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            {/* Display Filtered Response */}
            <div className="mt-4">
              {selectedFilters.length > 0 ? (
                selectedFilters.map((key) => (
                  <div
                    key={key}
                    className="bg-white p-3 my-2 border border-gray-200 rounded-md shadow-sm text-gray-800"
                  >
                    <strong className="text-blue-600">{key}:</strong>
                    <pre className="text-sm">{JSON.stringify(responseData[key], null, 2)}</pre>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm mt-2">Select options to view data.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
