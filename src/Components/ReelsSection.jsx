// ReelsSection.js
import React, { useEffect, useState } from "react";

const ReelsSection = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch("https://pg-hostel.nearprop.com/api/reels", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWRkNGQ3ZjllNzY0NjJmNmRiZTJkMSIsInJvbGUiOiJsYW5kbG9yZCIsIm1vYmlsZSI6Ijk3NTI4MTAxMzciLCJlbWFpbCI6InJlbnVrYWFncmF3YWw5N0BnbWFpbC5jb20iLCJpYXQiOjE3NTUxNzc3ODYsImV4cCI6MTc1Nzc2OTc4Nn0.5xU5ICA9TW-Y9Qn1TlMeB6xnQCdCn1F552vwChqTj3I",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.reels)) {
          setReels(data.reels);
        } else {
          setReels([]);
        }
      } catch (error) {
        console.error("Error fetching reels:", error);
        setReels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">
        🎥 Property Reels
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading reels...</p>
      ) : reels.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No reels available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reels.map((reel, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300"
            >
              <div className="relative group">
                <video
                  className="w-full h-64 object-cover"
                  controls
                  poster={reel.thumbnailUrl || ""}
                >
                  <source src={reel.videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300"></div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800">
                  {reel.title || `Reel ${index + 1}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded on {new Date(reel.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReelsSection;
