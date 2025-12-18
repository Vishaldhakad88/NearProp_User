import React, { useState } from 'react';

// Error Boundary Component for iframe
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Iframe error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h3 style={{ fontSize: '1.25rem', color: '#1a202c', textAlign: 'center' }}>
        Unable to load map. Please try again later.
      </h3>;
    }

    return this.props.children;
  }
}

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    gdpr: false,
  });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'First name should only contain letters';
        }
        break;
        
      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Last name should only contain letters';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
        
      case 'gdpr':
        if (!value) {
          error = 'You must agree to the terms and conditions';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      const error = validateField(name, fieldValue);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const error = validateField(name, fieldValue);
    
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    console.log('Form submitted:', formData);
    setShowConfirmation(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      gdpr: false,
    });
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  return (
    <>
      <section style={{ width: '100%' }}>
        <div
          style={{
            background: `url('https://img.freepik.com/premium-photo/minimalist-office-with-bright-green-laptop-small-plant-clean-organized_1325778-42324.jpg?ga=GA1.1.586528727.1721893114&semt=ais_hybrid') center center/cover no-repeat`,
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'normal' }}>Contact Us</h1>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: window.innerWidth <= 640 ? '20px' : '40px',
            padding: '20px',
          }}
        >
          <div style={{ flex: '1 1 60%', minWidth: window.innerWidth <= 640 ? '100%' : '300px' }}>
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                color: '#555',
                fontSize: '1rem',
              }}
            >
              <p>
                Design your custom contact forms with this Nearprop Elementor custom widget and connect your leads with the integrated Nearprop CRM.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  marginBottom: '15px',
                }}
              >
                <div style={{ flex: '1', minWidth: window.innerWidth <= 640 ? '100%' : '150px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.875rem', color: '#4a5568' }}>
                    First Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.firstName ? 'red' : '#ccc'}`,
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      color: '#1a202c',
                    }}
                  />
                  {errors.firstName && (
                    <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}>
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div style={{ flex: '1', minWidth: window.innerWidth <= 640 ? '100%' : '150px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.875rem', color: '#4a5568' }}>
                    Last Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.lastName ? 'red' : '#ccc'}`,
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      color: '#1a202c',
                    }}
                  />
                  {errors.lastName && (
                    <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}>
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.875rem', color: '#4a5568' }}>
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${errors.email ? 'red' : '#ccc'}`,
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#1a202c',
                  }}
                />
                {errors.email && (
                  <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}>
                    {errors.email}
                  </span>
                )}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.875rem', color: '#4a5568' }}>
                  Message <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${errors.message ? 'red' : '#ccc'}`,
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#1a202c',
                    resize: 'vertical',
                    height: '100px',
                  }}
                ></textarea>
                {errors.message && (
                  <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}>
                    {errors.message}
                  </span>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  marginBottom: '15px',
                }}
              >
                <input
                  type="checkbox"
                  id="gdpr"
                  name="gdpr"
                  checked={formData.gdpr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ marginTop: '3px' }}
                />
                <label
                  htmlFor="gdpr"
                  style={{ fontSize: '0.875rem', color: '#4a5568' }}
                >
                  <strong>Terms Condition</strong>
                  <br />
                  I consent to having this website store my submitted information
                </label>
              </div>
              {errors.gdpr && (
                <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '-10px', marginBottom: '10px', display: 'block' }}>
                  {errors.gdpr}
                </span>
              )}
              <button
                onClick={handleSubmit}
                style={{
                  width: '200px',
                  padding: '12px',
                  background: 'darkcyan',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '15px',
                }}
              >
                Submit
              </button>
            </div>
            {showConfirmation && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  background: '#d4edda',
                  color: '#155724',
                  border: '1px solid #c3e6cb',
                  borderRadius: '4px',
                  textAlign: 'center',
                }}
              >
                Thank you for your submission! We'll get back to you soon.
              </div>
            )}
          </div>

          <div
            style={{
              flex: '1 1 35%',
              minWidth: window.innerWidth <= 640 ? '100%' : '300px',
              fontSize: '0.95rem',
              color: '#333',
            }}
          >
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '15px' }}>
              For inquiries contact:
            </h4>
            <div
              style={{
                marginBottom: window.innerWidth <= 640 ? '10px' : '20px',
              }}
            >
              <strong>Aman Kumar</strong>
              <br />
              Zonal Manager (North & East India) <br />
              Ward No. 15, Kutumb Nagar, Etwa, Begusarai, Bihar – 851117
              <br />
              <a href="mailto:Aman@Nearprop.com" style={{ color: '#0073aa', textDecoration: 'none' }}>
                Aman@Nearprop.com
              </a>
            </div>
            <div
              style={{
                marginBottom: window.innerWidth <= 640 ? '10px' : '20px',
              }}
            >
              <strong>Jaideo</strong>
              <br />
              State Head (Bihar & Bengal) <br />
              Ward No. 15, Kutumb Nagar, Etwa, Begusarai, Bihar – 851117
              <br />
              <a href="mailto:Jaideo@Nearprop.com" style={{ color: '#0073aa', textDecoration: 'none' }}>
                Jaideo@Nearprop.com
              </a>
            </div>
            <div
              style={{
                marginBottom: window.innerWidth <= 640 ? '10px' : '20px',
              }}
            >
              <strong>Corporate Headquarters</strong>
              <br />
              Ward No. 15, Kutumb Nagar, Etwa, Begusarai, Bihar – 851117
              <br />
              <a href="mailto:Contact@Nearprop.com" style={{ color: '#0073aa', textDecoration: 'none' }}>
                Contact@Nearprop.com
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              <a href="https://www.facebook.com/Nearprop" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn-icons-png.flaticon.com/24/733/733547.png"
                  alt="Facebook"
                  style={{ width: '24px', height: '24px' }}
                />
              </a>
              <a href="https://whatsapp.com/channel/0029VbB066PFy72ADpApP924" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn-icons-png.flaticon.com/24/733/733585.png"
                  alt="WhatsApp"
                  style={{ width: '24px', height: '24px' }}
                />
              </a>
              <a href="https://www.instagram.com/nearprop" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png"
                  alt="Instagram"
                  style={{ width: '24px', height: '24px' }}
                />
              </a>
              <a href="https://www.youtube.com/@nearprop" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn-icons-png.flaticon.com/24/733/733646.png"
                  alt="YouTube"
                  style={{ width: '24px', height: '24px' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 20px 60px' }}>
        <ErrorBoundary>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d28826.999838343963!2d86.09644516722666!3d25.42572417345366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sRegistered%20Office%3A%20Ward%20No.15%2C%20Kutumb%20nagar%2C%20Etwa%2C%20PS-%20Singhaul%2C%20Dumri%2C%20Begusarai%2C%20BIhar%2C%20India%2C%20851117!5e0!3m2!1sen!2sin!4v1747227864331!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default Contact;