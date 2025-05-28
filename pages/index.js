import { useState } from "react";

export default function Home() {
  const [drugName, setDrugName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!drugName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/search?name=${encodeURIComponent(drugName)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching drug");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl max-w-xl w-full p-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 drop-shadow-md">
          Drug Search
        </h1>

        <form onSubmit={handleSearch} className="flex mb-6">
          <input
            type="text"
            placeholder="Enter drug name..."
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            className="flex-grow px-4 py-3 rounded-l-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-md text-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 rounded-r-lg font-semibold shadow-md
            transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {error && (
          <p className="text-red-600 font-medium text-center mb-4">{error}</p>
        )}

        {result && (
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-300 shadow-inner animate-fadeIn">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">{result.name}</h2>
            <p className="text-sm mb-2">
              <span className="font-semibold text-gray-700">Entry ID:</span> {result.entry}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold text-gray-700">Formula:</span> {result.formula}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold text-gray-700">Description:</span> {result.description}
            </p>
            <details className="mt-4 text-xs text-gray-600">
              <summary className="cursor-pointer text-indigo-600 underline">Show Raw Data</summary>
              <pre className="whitespace-pre-wrap max-h-48 overflow-auto mt-2">{result.raw}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
