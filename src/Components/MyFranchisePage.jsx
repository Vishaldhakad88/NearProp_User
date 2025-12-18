import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../../BaseUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyFranchisePage.css';

const showToast = (message, type = 'error') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  });
};

const getAuthData = () => {
  const authData = localStorage.getItem('authData');
  if (authData) {
    try {
      return JSON.parse(authData);
    } catch (err) {
      console.error('Error parsing authData:', err);
      return null;
    }
  }
  return null;
};

const getToken = () => {
  const authData = getAuthData();
  return authData?.token || null;
};

const MyFranchisePage = () => {
  const [franchiseRequests, setFranchiseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFranchiseRequests = async () => {
    setIsLoading(true);
    const token = getToken();
    if (!token) {
      showToast('Please log in to view your franchise requests.', 'error');
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      console.log('Fetching franchise requests with URL:', `${baseurl}/franchisee/requests/my-requests?page=0&size=10&sortBy=createdAt&direction=DESC`);
      const res = await axios.get(`${baseurl}/franchisee/requests/my-requests?page=0&size=10&sortBy=createdAt&direction=DESC`, config);
      console.log('Franchise requests response:', res.data);
      setFranchiseRequests(res.data.content || []);
      if (res.data.content.length === 0) {
        showToast('No franchise requests found.', 'info');
      }
    } catch (error) {
      console.error('Franchise requests fetch error:', error.response || error);
      const errorMsg = error.response?.status === 401 ? 'Unauthorized: Please log in again.' :
        error.response?.status === 403 ? 'Forbidden: You lack permission to view franchise requests.' :
          error.response?.data?.message || 'Failed to fetch franchise requests. Please try again.';
      showToast(errorMsg);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelFranchiseRequest = async (requestId) => {
    if (isLoading) return;
    setIsLoading(true);
    const token = getToken();
    if (!token) {
      showToast('Please log in to cancel franchise request.', 'error');
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      console.log('Canceling franchise request ID:', requestId);
      const res = await axios.delete(`${baseurl}/franchisee/requests/${requestId}`, config);
      console.log('Cancel franchise request response:', res.status);
      if (res.status === 200 || res.status === 204) {
        showToast('Franchise request canceled successfully.', 'success');
        await fetchFranchiseRequests();
      }
    } catch (error) {
      console.error('Cancel franchise request error:', error.response || error);
      const errorMsg = error.response?.status === 401 ? 'Unauthorized: Please log in again.' :
        error.response?.status === 403 ? 'Forbidden: You lack permission to cancel this request.' :
          error.response?.data?.message || 'Failed to cancel franchise request. Please try again.';
      showToast(errorMsg);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchiseRequests();
  }, []);

  return (
    <div className="my-franchise-container">
      <ToastContainer />
      <div className="franchise-requests-container">
        <div className="header-section">
          <h2 className="header-title">My Franchise Requests</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={() => navigate('/')}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading your franchise requests...</p>
          </div>
        ) : franchiseRequests.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No franchise requests found.</p>
            <Link to="/franchise-request" className="action-link">
              Submit a new franchise request
            </Link>
          </div>
        ) : (
          <div className="requests-grid">
            {franchiseRequests.map((request) => (
              <div key={request.id} className="request-card">
                <h3 className="request-title">{request.businessName}</h3>
                <div className="request-details">
                  <p><strong>District:</strong> {request.districtName}, {request.state}</p>
                  <p><strong>Business Address:</strong> {request.businessAddress}</p>
                  <p><strong>Registration Number:</strong> {request.businessRegistrationNumber}</p>
                  <p><strong>GST Number:</strong> {request.gstNumber}</p>
                  <p><strong>PAN Number:</strong> {request.panNumber}</p>
                  <p><strong>Aadhar Number:</strong> {request.aadharNumber}</p>
                  <p><strong>Contact Email:</strong> {request.contactEmail}</p>
                  <p><strong>Contact Phone:</strong> {request.contactPhone}</p>
                  <p><strong>Years of Experience:</strong> {request.yearsOfExperience}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </p>
                  <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                  <p><strong>Updated At:</strong> {new Date(request.updatedAt).toLocaleDateString()}</p>
                  <div className="documents-section">
                    <p className="documents-title">Documents:</p>
                    {request.documentUrls && request.documentUrls.length > 0 ? (
                      <ul className="document-list">
                        {request.documentUrls.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              Document {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No documents uploaded.</p>
                    )}
                  </div>
                </div>
                <div className="request-actions">
                  {request.status === 'PENDING' ? (
                    <button
                      className="delete-button"
                      onClick={() => cancelFranchiseRequest(request.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Deleting...' : 'Delete Request'}
                    </button>
                  ) : (
                    <span className="status-confirmed">Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFranchisePage;
