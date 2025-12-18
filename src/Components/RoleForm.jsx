import React, { useState } from 'react';
import axios from 'axios';
import { baseurl, getToken } from './utils.js';


const RoleForm = ({ isVisible, onClose }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [reason, setReason] = useState('');

  const handleRoleRequest = async () => {
    if (!selectedRole || !reason.trim()) {
      alert('Please select a role and provide a reason.');
      return;
    }

    const token = getToken();
    if (!token) {
      alert('Please log in to request a role.');
      return;
    }

    try {
      const payload = {
        role: selectedRole.toUpperCase(),
        reason,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(`${baseurl}/v1/auth/request-role`, payload, config);
      if (res.data.success) {
        alert('Role request submitted successfully!');
        onClose();
      } else {
        alert('Failed to submit role request.');
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
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-lg font-semibold text-dark">Request Role</h5>
          <button className="text-2xl text-dark" onClick={onClose}>×</button>
        </div>
        <div>
          <label className="block text-dark mb-2">Choose Role</label>
          <select
            className="w-full border rounded-md p-2 mb-4"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="Developer">Developer</option>
            <option value="Seller">Seller</option>
            <option value="Advisor">Property Advisor</option>
          </select>
          <label className="block text-dark mb-2">Reason for Role</label>
          <textarea
            className="w-full border rounded-md p-2 mb-4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you want this role"
            rows="4"
          ></textarea>
          <button
            className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
            onClick={handleRoleRequest}
          >
            Request Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;