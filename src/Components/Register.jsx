import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';
import { baseurl } from '../../BaseUrl';

const authPrefix = 'v1/auth';

function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState('');
  const [response, setResponse] = useState(null);
  const [resendPhoneDisabled, setResendPhoneDisabled] = useState(true);
  const [phoneResendCountdown, setPhoneResendCountdown] = useState(0);
  const [showResendLink, setShowResendLink] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { code: '+91', label: '+91' },
    { code: '+1', label: '+1' },
    { code: '+44', label: '+44' },
    { code: '+61', label: '+61' },
    { code: '+81', label: '+81' },
    { code: '+86', label: '+86' },
    { code: '+33', label: '+33' },
    { code: '+49', label: '+49' },
  ];

  useEffect(() => {
    const info = `${navigator.platform} - ${navigator.userAgent}`;
    setDeviceInfo(info);
  }, []);

  useEffect(() => {
    if (phoneResendCountdown > 0) {
      const timer = setInterval(() => {
        setPhoneResendCountdown((prev) => {
          if (prev <= 1) {
            setResendPhoneDisabled(false);
            setShowResendLink(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phoneResendCountdown]);

  const validateName = (value) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!value) {
      return 'Please enter your full name.';
    }
    if (!nameRegex.test(value)) {
      return 'Name can only contain letters and spaces.';
    }
    return '';
  };

  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value) {
      return 'Please enter a phone number.';
    }
    if (!phoneRegex.test(value)) {
      return 'Phone number must be exactly 10 digits.';
    }
    return '';
  };


  

  const validateOtp = (value) => {
    const otpRegex = /^[0-9]{4,6}$/;
    if (!value) {
      return 'Please enter the OTP.';
    }
    if (!otpRegex.test(value)) {
      return 'OTP must be 4-6 digits.';
    }
    return '';
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorDialog(true);
  };

  const closeErrorDialog = () => {
    setShowErrorDialog(false);
    setErrorMessage('');
    setNameError('');
    setPhoneError('');
    setOtpError('');
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setName(value);
    setNameError(validateName(value));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPhoneOtp(value);
    setOtpError(validateOtp(value));
  };

  const handleSendOtps = async (e) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    setNameError(nameErr);
    setPhoneError(phoneErr);

    if (nameErr || phoneErr) {
      showError(nameErr || phoneErr);
      return;
    }

    try {
      const fullPhoneNumber = `${countryCode}${phone}`;
      const payload = {
        name,
        mobileNumber: fullPhoneNumber,
        deviceInfo,
      };
      const res = await axios.post(`${baseurl}/${authPrefix}/register`, payload);
      setResponse(res.data);

      if (res.data.success && res.data.data.mobileVerified) {
        setShowSuccessDialog(true);
        setName('');
        setPhone('');
        setCountryCode('+91');
        setTimeout(() => {
          setShowSuccessDialog(false);
          navigate('/');
        }, 3000);
        return;
      }

      if (res.data.success && !res.data.data.mobileVerified) {
        setOtpSent(true);
        setResendPhoneDisabled(true);
        setPhoneResendCountdown(30);
        setShowResendLink(false);
        toast.success('OTP sent to your phone number!');
      }
    } catch (error) {
      let errorMsg = 'Failed to register. Please try again.';
      if (error.response) {
        if (error.response.data?.error?.message) {
          errorMsg = error.response.data.error.message;
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMsg = 'Unauthorized: Please log in again.';
        } else if (error.response.status === 403) {
          errorMsg = 'Forbidden: You lack permission.';
        }
      }
      showError(errorMsg);
    }
  };

  const handleResendMobileOtp = async () => {
    if (resendPhoneDisabled) {
      showError('Please wait for the countdown to finish.');
      return;
    }

    try {
      const fullPhoneNumber = `${countryCode}${phone}`;
      const payload = { mobileNumber: fullPhoneNumber };
      const res = await axios.post(`${baseurl}/v1/auth/resend-mobile-otp`, payload);
      setResponse(res.data);
      setResendPhoneDisabled(true);
      setPhoneResendCountdown(30);
      setShowResendLink(false);
      toast.success('OTP resent successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend Mobile OTP.';
      showError(errorMessage);
    }
  };

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    const otpErr = validateOtp(phoneOtp);
    setOtpError(otpErr);

    if (otpErr) {
      showError(otpErr);
      return;
    }

    try {
      const fullPhoneNumber = `${countryCode}${phone}`;
      const payload = {
        identifier: fullPhoneNumber,
        code: phoneOtp,
        type: 'MOBILE',
        deviceInfo,
      };
      const res = await axios.post(`${baseurl}/v1/auth/verify-otp`, payload);
      setPhoneOtpVerified(true);
      setShowSuccessDialog(true);
      setName('');
      setPhone('');
      setPhoneOtp('');
      setCountryCode('+91');
      setOtpSent(false);
      setPhoneOtpVerified(false);
      toast.success('Phone OTP verified successfully!');
      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify Phone OTP.';
      showError(errorMessage);
    }
  };

  return (
    <div className="registerbody">
      <div className="registeruser-container">
        {!otpSent && (
          <>
            <p className="welcome-text">Welcome to Nearprop</p>
            <h2 className="registeruser-heading">Create Account</h2>
            <form onSubmit={handleSendOtps} className="register-form">
              <div className="registeruser-input-group">
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Full Name"
                  required
                  className={`form-control ${nameError ? 'error-input' : ''}`}
                />
                <label>Full Name</label>
                {nameError && <p className="error-message">{nameError}</p>}
              </div>

              <div className="registeruser-input-group phone-group">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-code-select"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit Phone Number"
                  required
                  className={`form-control phone-input ${phoneError ? 'error-input' : ''}`}
                />
                <label>Phone Number</label>
                {phoneError && <p className="error-message">{phoneError}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary registeruser-btn"
              >
                Register (Send OTP)
              </button>
            </form>
          </>
        )}

        {otpSent && !phoneOtpVerified && (
          <div className="verify-container">
            <h2 className="verify-heading">Verify OTP</h2>
            <div className="verify-section">
              <label className="form-label">Phone Verification</label>
              <input
                type="text"
                placeholder="Enter Phone OTP"
                className={`form-control mb-2 ${otpError ? 'error-input' : ''}`}
                value={phoneOtp}
                onChange={handleOtpChange}
                disabled={phoneOtpVerified}
              />
              {otpError && <p className="error-message">{otpError}</p>}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success verify-btn"
                  onClick={handleVerifyPhoneOtp}
                >
                  Verify
                </button>
                {phoneResendCountdown > 0 ? (
                  <span className="resend-timer">Resend OTP in {phoneResendCountdown}s</span>
                ) : (
                  showResendLink && (
                    <button
                      className="btn btn-outline-secondary resend-btn"
                      onClick={handleResendMobileOtp}
                      disabled={resendPhoneDisabled}
                    >
                      Resend OTP
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {showErrorDialog && (
          <div className="error-dialog">
            <div className="error-dialog-content">
              <h3>Error</h3>
              <p>{errorMessage}</p>
              <button onClick={closeErrorDialog} className="error-dialog-button">
                OK
              </button>
            </div>
          </div>
        )}

        {showSuccessDialog && (
          <div className="error-dialog">
            <div className="error-dialog-content">
              <h3>Success</h3>
              <p>Registration completed successfully! Redirecting to homepage...</p>
              <button onClick={closeSuccessDialog} className="error-dialog-button">
                OK
              </button>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}

export default Register;