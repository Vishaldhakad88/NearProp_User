import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseurl } from './utils.js';
import { getToken } from './utils.js';

const MyFranchiseModal = ({ isVisible, onClose }) => {
  const [franchiseRequests, setFranchiseRequests] = useState([]);

  useEffect(() => {
    if (isVisible) {
      fetchFranchiseRequests();
    }
  }, [isVisible]);

  const fetchFranchiseRequests = async () => {
    const token = getToken();
    if (!token) {
      alert('Please log in to view franchise requests.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`${baseurl}/franchisee/requests/my-requests?page=0&size=10&sortBy=createdAt&direction=DESC`, config);
      setFranchiseRequests(res.data.content || []);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.statusText
        : error.request
        ? 'No response from server'
        : error.message;
      alert(`Error: ${errorMessage}`);
    }
  };

  const cancelFranchiseRequest = async (requestId) => {
    const token = getToken();
    if (!token) {
      alert('Please log in to cancel a franchise request.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.delete(`${baseurl}/franchisee/requests/${requestId}`, config);
      if (res.status === 200 || res.status === 204) {
        alert('Franchise request deleted successfully!');
        await fetchFranchiseRequests();
      } else {
        alert('Failed to delete franchise request.');
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.statusText
        : error.request
        ? 'No response from server'
        : error.message;
      alert(`Error: ${errorMessage}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-lg font-semibold text-dark">My Franchise Requests</h5>
          <button className="text-2xl text-dark" onClick={onClose}>×</button>
        </div>
        <div>
          {franchiseRequests.length === 0 ? (
            <p className="text-dark text-center">No franchise requests found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {franchiseRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
                >
                  <h6 className="text-lg font-semibold text-dark mb-2">{request.businessName}</h6>
                  <div className="grid grid-cols-1 text-dark gap-2 text-sm">
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
                      <span
                        className={
                          request.status === 'PENDING'
                            ? 'text-yellow-600 font-semibold'
                            : 'text-green-600 font-semibold'
                        }
                      >
                        {request.status}
                      </span>
                    </p>
                    <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                    <p><strong>Updated At:</strong> {new Date(request.updatedAt).toLocaleDateString()}</p>
                    <div>
                      <p className="font-semibold">Documents:</p>
                      {request.documentUrls && request.documentUrls.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {request.documentUrls.map((url, index) => (
                            <li key={index}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
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
                  <div className="mt-4">
                    {request.status === 'PENDING' ? (
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                        onClick={() => cancelFranchiseRequest(request.id)}
                      >
                        Delete Request
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Confirmed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFranchiseModal;