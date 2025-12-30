// import React, { useState, useEffect } from 'react';
// import './UserProfile.css';
// import axios from 'axios';
// import { baseurl } from '../../BaseUrl';
// import { useNavigate } from 'react-router-dom';

// function UserProfile() {
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: '',
//     profileImageUrl: 'https://nearprop-documents.s3.ap-south-1.amazonaws.com/defaults/default-user-profile.png',
//   });
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(profileData.profileImageUrl);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Retrieve token from localStorage
//   const getToken = () => {
//     console.log('getToken called');
//     const authData = localStorage.getItem('authData');
//     console.log('Raw authData from localStorage:', authData);
//     if (authData) {
//       try {
//         const parsedData = JSON.parse(authData);
//         console.log('Retrieved authData in UserProfile:', parsedData);
//         console.log('Token:', parsedData.token);
//         return parsedData.token || null;
//       } catch (err) {
//         console.error('Error parsing authData:', err.message);
//         return null;
//       }
//     } else {
//       console.log('No authData found in localStorage in UserProfile');
//       return null;
//     }
//   };

//   const token = getToken();

//   // Check if user is authenticated, redirect to login if not
//   useEffect(() => {
//     if (!token) {
//       console.log('No token found, redirecting to login');
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//     }
//   }, [token, navigate]);

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) {
//         console.log('No token found, navigating to login');
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         navigate('/login');
//         return;
//       }

//       try {
//         const profileUrl = `${baseurl}/v1/users/profile`;
//         console.log('Fetching profile from URL:', profileUrl);

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(profileUrl, config);
//         console.log('Profile API response:', response);

//         if (response.data.success) {
//           const { name, email, phoneNumber, profileImageUrl } = response.data.data;
//           setProfileData({ name, email, phoneNumber, profileImageUrl: profileImageUrl || profileData.profileImageUrl });
//           setPreviewUrl(profileImageUrl || profileData.profileImageUrl);
//         } else {
//           setError('Failed to fetch profile data: ' + response.data.message);
//         }
//       } catch (err) {
//         console.error('Profile fetch error:', err);
//         console.error('Full error response:', err.response?.data || err.message);
//         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//           console.log('Token invalid/expired, redirecting to login...');
//           localStorage.removeItem('authData');
//           navigate('/login');
//           return;
//         }
//         setError('Error fetching profile: ' + (err.response?.data?.message || err.message));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [token, navigate]);

//   // Handle image selection and preview
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Validate file type and size
//       if (!['image/jpeg', 'image/png'].includes(file.type)) {
//         alert('Please select a JPEG or PNG image.');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size exceeds 5MB limit.');
//         return;
//       }

//       console.log('Image selected:', file.name);
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         console.log('Image preview URL set');
//         setPreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle profile update submission
//   const handleProfileUpdate = async (event) => {
//     event.preventDefault();
//     console.log('handleProfileUpdate called');

//     if (!token) {
//       console.log('No token found for profile update');
//       alert('Session expired. Please log in again.');
//       navigate('/login');
//       return;
//     }

//     const formPayload = new FormData();
//     formPayload.append('name', profileData.name);
//     formPayload.append('email', profileData.email);
//     if (selectedImage) {
//       formPayload.append('image', selectedImage);
//     }

//     // Log FormData entries for debugging
//     console.log('FormData entries:', Array.from(formPayload.entries()));
//     console.log('Token length:', token?.length);

//     try {
//       const updateUrl = `${baseurl}/v1/users/profile-update`;
//       console.log('Updating profile at URL:', updateUrl);

//       const response = await axios.put(updateUrl, formPayload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Profile update API response:', response);

//       if (response.data.success) {
//         console.log('Profile update successful');
//         alert('Profile updated successfully!');
//         setProfileData({
//           ...profileData,
//           profileImageUrl: response.data.data.profileImageUrl || profileData.profileImageUrl,
//         });
//         setPreviewUrl(response.data.data.profileImageUrl || profileData.profileImageUrl);
//         setSelectedImage(null);
//       } else {
//         console.log('Profile update failed, success: false');
//         console.log('Response message:', response.data.message);
//         alert('Failed to update profile: ' + response.data.message);
//       }
//     } catch (err) {
//       console.error('Profile update error:', err);
//       console.error('Full error response:', err.response?.data || err.message);
//       if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//         console.log('Token invalid/expired, redirecting to login...');
//         localStorage.removeItem('authData');
//         alert('Session expired. Please log in again.');
//         navigate('/login');
//         return;
//       }
//       if (err.response?.status === 500) {
//         alert('Server error occurred while updating profile. Please try again later or contact support.');
//       } else {
//         alert('Error updating profile: ' + (err.response?.data?.message || err.message));
//       }
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     console.log('handleLogout called');
//     localStorage.removeItem('authData');
//     console.log('authData removed from localStorage');
//     alert('You have been logged out successfully.');
//     navigate('/login');
//   };

//   return (
//     <div className="userprofile-fullscreen">
//       <div className="userprofile-overlay">
//         {loading ? (
//           <p className="userprofile-loading">Loading profile data...</p>
//         ) : error ? (
//           <p className="error-message">{error}</p>
//         ) : (
//           <div className="userprofile-card">
//             <h2 className="userprofile-title">Your Profile</h2>
//             <form onSubmit={handleProfileUpdate}>
//               <div className="userprofile-row">
//                 {/* Left: Upload Profile Image */}
//                 <div className="userprofile-left">
//                   <label htmlFor="profileImg" className="userprofile-upload-box">
//                     <img
//                       id="previewImg"
//                       src={previewUrl}
//                       alt="Profile Preview"
//                       title="Profile Preview"
//                     />
//                     <input
//                       type="file"
//                       id="profileImg"
//                       accept="image/jpeg,image/png"
//                       onChange={handleImageChange}
//                       className="userprofile-file-input"
//                     />
//                     <span className="userprofile-upload-text">Select Image (JPEG/PNG, max 5MB)</span>
//                   </label>
//                 </div>

//                 {/* Right: Display Fields */}
//                 <div className="userprofile-right">
//                   <div className="userprofile-input-group">
//                     <label htmlFor="name">Name</label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={profileData.name}
//                       onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//                       placeholder="Enter your name"
//                     />
//                   </div>

//                   <div className="userprofile-input-group">
//                     <label htmlFor="email">Email *</label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={profileData.email}
//                       onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//                       placeholder="Enter your email"
//                       className="userprofile-email-input"
//                       required
//                     />
//                   </div>

//                   <div className="userprofile-input-group">
//                     <label htmlFor="phoneNumber">Mobile Number</label>
//                     <input
//                       type="tel"
//                       id="phoneNumber"
//                       name="phoneNumber"
//                       value={profileData.phoneNumber}
//                       placeholder="Your mobile number"
//                       maxLength="10"
//                       readOnly
//                     />
//                     <small className="userprofile-input-hint">
//                       Country code (+91) is applied by default. Mobile number cannot be updated.
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               <div className="userprofile-button-group">
//                 <button type="submit" className="userprofile-btn">
//                   Update Profile 
//                 </button>
//                 <button
//                   type="button"
//                   className="userprofile-btn userprofile-logout-btn"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserProfile;

import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import axios from "axios";
import { baseurl } from "../../BaseUrl";
import { useNavigate } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";

function UserProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    permanentId: "",
    profileImageUrl:
      "https://nearprop-documents.s3.ap-south-1.amazonaws.com/defaults/default-user-profile.png",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profileData.profileImageUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const getToken = () => {
    const authData = localStorage.getItem("authData");
    if (!authData) return null;
    try {
      return JSON.parse(authData).token || null;
    } catch {
      return null;
    }
  };

  const token = getToken();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseurl}/v1/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const {
            name,
            email,
            phoneNumber,
            permanentId,
            profileImageUrl,
          } = response.data.data;

          setProfileData({
            name,
            email,
            phoneNumber,
            permanentId, // ✅ from API
            profileImageUrl:
              profileImageUrl || profileData.profileImageUrl,
          });

          setPreviewUrl(profileImageUrl || profileData.profileImageUrl);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= IMAGE ================= */
  const handleImageChange = (e) => {
    if (!isEditing) return;

    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= UPDATE ================= */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setValidationError("");

    // ✅ Email optional: sirf tab validate karo jab email filled ho
if (profileData.email) {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(profileData.email)) {
    setValidationError("Please enter a valid email address.");
    return;
  }
}

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      await axios.put(`${baseurl}/v1/users/profile-update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      alert("Error updating profile");
    }
  };

  /* ================= COPY PERMANENT ID ================= */
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(profileData.permanentId);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("Failed to copy ID");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/login");
  };

  if (loading) return <p className="userprofile-loading">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="userprofile-fullscreen">
      <div className="userprofile-overlay">
        <div className="userprofile-card">
          <h2 className="userprofile-title">Your Profile</h2>
          {validationError && (
            <p className="error-message">{validationError}</p>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="userprofile-row">
              {/* IMAGE */}
             <div className="userprofile-left">
  <label className="userprofile-upload-box">
    <img src={previewUrl} alt="Profile" />

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      disabled={!isEditing}
    />

    {/* ✅ Camera icon ONLY in edit mode */}
    {isEditing && (
      <span className="userprofile-camera-icon">
        <FaCamera />
      </span>
    )}
  </label>
</div>


              {/* INPUTS */}
              <div className="userprofile-right">
                <div className="userprofile-input-group">
                  <label>Permanent ID</label>
                  <div className="userprofile-id-container">
                    <input
                      type="text"
                      value={profileData.permanentId}
                      readOnly
                    />
                    <button
                      type="button"
                      className="userprofile-copy-btn"
                      onClick={handleCopyId}
                      title="Copy Permanent ID"
                    >
                      <FiCopy />
                    </button>
                  </div>
                  {copySuccess && (
                    <small className="userprofile-copy-success">
                      ID copied
                    </small>
                  )}
                </div>

                <div className="userprofile-input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="userprofile-input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="userprofile-input-group">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    value={profileData.phoneNumber}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="userprofile-button-group">
              {isEditing ? (
                <>
                  <button type="submit" className="userprofile-btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="userprofile-btn userprofile-cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="userprofile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}

              <button
                type="button"
                className="userprofile-btn userprofile-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
