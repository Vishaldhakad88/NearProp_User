import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import "./ReviewsSection.css";

const API_CONFIG = {
  baseUrl: "https://pg-hostel.nearprop.com",
  apiPrefix: "api/public",
};

const ReviewsSection = ({ propertyId, reviews, setReviews, averageRating, reviewCount }) => {
  const [reviewForm, setReviewForm] = useState({ rating: 0, review: "" });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({
    averageRating: parseFloat(averageRating) || 0,
    totalRatings: reviewCount || 0,
    ratingDistribution: {},
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return null;
      const parsedData = JSON.parse(authData);
      return parsedData.token || null;
    } catch (err) {
      console.error("Error parsing authData:", err.message);
      return null;
    }
  };

  const token = getToken();

  const fetchRatingStats = async () => {
    try {
      setError(null);
      const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const res = await axios.get(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property/${propertyId}/rating-stats`,
        { headers }
      );
      console.log("Rating Stats Response:", res.data);
      if (res.data.success) {
        setRatingStats(res.data.stats || { averageRating: 0, totalRatings: 0, ratingDistribution: {} });
      } else {
        setRatingStats({ averageRating: 0, totalRatings: 0, ratingDistribution: {} });
        setError("No rating stats available.");
      }
    } catch (err) {
      console.error("Error fetching rating stats:", err.response || err);
      setRatingStats({ averageRating: 0, totalRatings: 0, ratingDistribution: {} });
      setError(
        err.response?.status === 404
          ? "Rating stats not found."
          : err.response?.status === 401
          ? "Unauthorized access. Please log in."
          : "Failed to load rating stats."
      );
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    }
  };

  const fetchRatings = async () => {
    try {
      setError(null);
      const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const res = await axios.get(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property/${propertyId}/reviews?page=1&limit=10&sortBy=createdAt&sortOrder=desc`,
        { headers }
      );
      console.log("Ratings Response:", res.data);
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      } else {
        setReviews([]);
        setError("No ratings available.");
      }
    } catch (err) {
      console.error("Error fetching ratings:", err.response || err);
      setReviews([]);
      setError(
        err.response?.status === 404
          ? "Ratings not found."
          : err.response?.status === 401
          ? "Unauthorized access. Please log in."
          : "Failed to load ratings."
      );
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    }
  };

  const fetchComments = async () => {
    try {
      setError(null);
      const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const res = await axios.get(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property/${propertyId}/comments?page=1&limit=10`,
        { headers }
      );
      console.log("Comments Response:", res.data);
      if (res.data.success) {
        setComments(res.data.comments || []);
      } else {
        setComments([]);
        setError("No comments available.");
      }
    } catch (err) {
      console.error("Error fetching comments:", err.response || err);
      setComments([]);
      setError(
        err.response?.status === 404
          ? "Comments not found."
          : err.response?.status === 401
          ? "Unauthorized access. Please log in."
          : "Failed to load comments."
      );
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    }
  };

  useEffect(() => {
    if (!propertyId) {
      setError("Invalid property ID.");
      return;
    }
    fetchRatingStats();
    fetchRatings();
    fetchComments();
  }, [propertyId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to submit a rating.");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (reviewForm.rating === 0) {
      setError("Please select a rating.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property/${propertyId}/ratings`,
        {
          rating: reviewForm.rating,
          review: reviewForm.review,
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      console.log("Submit Review Response:", res.data);
      if (res.data.success) {
        setReviewForm({ rating: 0, review: "" });
        setError(null);
        fetchRatingStats();
        fetchRatings();
      } else {
        setError("Failed to submit rating.");
      }
    } catch (err) {
      console.error("Error submitting review:", err.response || err);
      setError(
        err.response?.status === 401
          ? "Unauthorized access. Please log in."
          : err.response?.status === 404
          ? "Rating submission endpoint not found."
          : "Failed to submit rating."
      );
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    }
    setLoading(false);
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    if (!token) {
      setError("Please log in to submit a comment.");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property/${propertyId}/comments`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      console.log("Submit Comment Response:", res.data);
      if (res.data.success) {
        setNewComment("");
        setError(null);
        fetchComments();
      } else {
        setError("Failed to submit comment.");
      }
    } catch (err) {
      console.error("Error submitting comment:", err.response || err);
      setError(
        err.response?.status === 401
          ? "Unauthorized access. Please log in."
          : err.response?.status === 404
          ? "Comment submission endpoint not found."
          : "Failed to submit comment."
      );
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    }
    setLoading(false);
  };

  const handleStarClick = (rating) => setReviewForm({ ...reviewForm, rating });
  const handleStarHover = (rating) => setHoveredRating(rating);

  return (
    <div className="review-section">
      <style jsx>{`
        .error-text {
          color: #dc2626;
          font-size: 0.9rem;
          text-align: center;
          padding: 10px;
        }
      `}</style>

      {error && <p className="error-text">{error}</p>}

      <h3 className="rating-title">
        {ratingStats.totalRatings} Ratings{" "}
        <span className="avg-rating">
          ({Number(ratingStats.averageRating).toFixed(1)} / 5)
        </span>
      </h3>

      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="rating-row">
            <span className="star-label">{star} ★</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ratingStats.totalRatings
                      ? ((ratingStats.ratingDistribution?.[star] || 0) / ratingStats.totalRatings) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <span className="count">
              {ratingStats.ratingDistribution?.[star] || 0}
            </span>
          </div>
        ))}
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="empty-text">No ratings yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div>
                  <p className="review-user">
                    {review.userName || "Anonymous"}
                  </p>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FontAwesomeIcon
                        key={num}
                        icon={
                          num <= review.rating ? faSolidStar : faRegularStar
                        }
                        className="star-icon"
                      />
                    ))}
                  </div>
                </div>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="review-text">{review.review}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleReviewSubmit} className="review-form">
        <h4 className="form-title">Submit Your Rating</h4>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((num) => (
            <FontAwesomeIcon
              key={num}
              icon={
                num <= (hoveredRating || reviewForm.rating)
                  ? faSolidStar
                  : faRegularStar
              }
              className="star-icon clickable"
              onClick={() => handleStarClick(num)}
              onMouseEnter={() => handleStarHover(num)}
              onMouseLeave={() => handleStarHover(0)}
            />
          ))}
        </div>
        <textarea
          value={reviewForm.review}
          onChange={(e) =>
            setReviewForm({ ...reviewForm, review: e.target.value })
          }
          placeholder="Enter your review"
        />
        <button type="submit" disabled={reviewForm.rating === 0 || loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="comment-section">
        <h4 className="form-title">Comments</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={addComment} disabled={loading || !newComment.trim()}>
          {loading ? "Submitting..." : "Add Comment"}
        </button>
        {comments.length === 0 ? (
          <p className="empty-text">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <p className="comment-user">{comment.userName || "Anonymous"}</p>
              <p className="comment-text">{comment.comment}</p>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;