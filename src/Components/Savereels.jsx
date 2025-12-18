import React, { useEffect, useState } from "react";
import './Reels.css'; // Ensure this CSS file exists

const API_CONFIG = {
  baseUrl: 'https://api.nearprop.com',
  apiPrefix: 'api',
};

const PG_API_URL = 'https://pg-hostel.nearprop.com/api';

const getToken = () => {
  try {
    const authData = localStorage.getItem('authData');
    if (!authData) return null;
    const parsedData = JSON.parse(authData);
    return parsedData.token || null;
  } catch (err) {
    console.error('Error parsing authData:', err.message);
    return null;
  }
};

function Savereels() {
  const [savedReels, setSavedReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedReels = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Please log in to view saved reels');
        }

        // Fetch saved reels from the server
        const response = await fetch(`${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/reels/saved`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          const serverSavedReels = result.data || [];
          // Merge with localStorage (optional: prioritize server data)
          const localSavedReels = JSON.parse(localStorage.getItem("savedReels")) || [];
          const mergedReels = [...localSavedReels];

          // Update localStorage with server data
          localStorage.setItem("savedReels", JSON.stringify(mergedReels));
          setSavedReels(mergedReels);
        } else {
          throw new Error(result.message || 'Failed to fetch saved reels');
        }
      } catch (err) {
        console.error('Fetch saved reels error:', err.message);
        setError(err.message || 'Error fetching saved reels');
        // Fallback to localStorage if server fetch fails
        const localSavedReels = JSON.parse(localStorage.getItem("savedReels")) || [];
        setSavedReels(localSavedReels);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedReels();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="saved-reels-page">
      <h2>Saved Reels</h2>
      {savedReels.length === 0 ? (
        <p>No saved reels yet.</p>
      ) : (
        <div className="saved-reels-list">
          {savedReels.map((reel) => (
            <div key={reel.id} className="saved-reel-item">
              <video
                src={reel.videoUrl || 'https://via.placeholder.com/300x400?text=Video+Not+Available'}
                controls
                className="saved-reel-video"
                onError={() => console.error(`Failed to load video for reel ${reel.id}`)}
              />
              <div className="saved-reel-info">
                <img
                  src={reel.owner?.profileImageUrl || 'https://nearprop-documents.s3.ap-south-1.amazonaws.com/defaults/default-user-profile.png'}
                  alt={reel.owner?.name || 'Unknown User'}
                  className="profile-pic"
                  onError={(e) => (e.target.src = 'https://nearprop-documents.s3.ap-south-1.amazonaws.com/defaults/default-user-profile.png')}
                />
                <p>{reel.owner?.name || 'Unknown User'}</p>
                <p>{reel.title || 'No caption'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Savereels;