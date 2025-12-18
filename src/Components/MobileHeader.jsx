import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLocationDot, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import RoleForm from './RoleForm.jsx';
import FranchiseForm from './FranchiseForm.jsx';
import MyFranchiseModal from './MyFranchiseModal.jsx';
import { getToken, getCurrentLocation, getTrimmedLocation, fetchDistricts } from './utils.js';
import logo from '../assets/logo.png';

const MobileHeader = ({ path, isLanding }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleFormVisible, setRoleFormVisible] = useState(false);
  const [franchiseFormVisible, setFranchiseFormVisible] = useState(false);
  const [myFranchiseVisible, setMyFranchiseVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const propertyItems = [
    { path: '/properties', label: 'Properties' },
    { path: '/residential', label: 'Residential' },
    { path: '/commercial', label: 'Commercial' },
  ];

  const othersItems = [
    { path: '/about', label: 'About' },
    { path: '/enquiryform', label: 'Inquiry Form' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'Faq' },
    { path: '/residential', label: 'Residential' },
    { path: '/commercial', label: 'Commercial' },
    { path: '/termsandcondition', label: 'Terms and Conditions' },
    { path: '/privacyandpolicy', label: 'Privacy' },
  ];

  useEffect(() => {
    fetchDistricts();
    if (!isLanding) return;

    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    const token = getToken();
    if (token && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCurrentLocation(latitude, longitude, setCurrentLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setCurrentLocation('Location not found');
        },
        { timeout: 10000 }
      );
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLanding]);

  return (
    <header className={`${isLanding ? 'fixed top-0 w-full transparent-header text-white' : 'relative white-header text-dark'}`}>
      <div className="flex items-center justify-between mx-auto px-5 py-2">
        <div className="flex items-center">
          <button
            className="flex flex-col space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="w-6 h-0.5 bg-current"></span>
            <span className="w-6 h-0.5 bg-current"></span>
            <span className="w-6 h-0.5 bg-current"></span>
          </button>
        </div>
        <Link to="/" className="flex items-center no-underline">
          <img src={logo} alt="Logo" className="w-32" />
          <span className={`text-2xl font-bold ${isLanding ? 'text-white' : 'text-darkcyan'}`}>
            Nearprop
          </span>
        </Link>
        <div className="flex items-center">
          <Link to={isLoggedIn ? '/userprofile' : '/login'}>
            <FontAwesomeIcon
              icon={faCircleUser}
              size="2xl"
              className={`cursor-pointer ${isLanding ? 'text-white' : 'text-dark'}`}
            />
          </Link>
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-24" />
            <span className="text-xl font-bold text-darkcyan">Nearprop</span>
          </div>
          <button
            className="text-2xl text-dark"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>
        <ul className="p-4 space-y-2 overflow-y-auto h-full">
          <li><Link to="/" className="block text-dark hover:text-darkcyan" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/properties" className="block text-dark hover:text-darkcyan" onClick={() => setMenuOpen(false)}>Property</Link></li>
          <li><Link to="/agent" className="block text-dark hover:text-darkcyan" onClick={() => setMenuOpen(false)}>Advisor</Link></li>
          <li><Link to="/developer" className="block text-dark hover:text-darkcyan" onClick={() => setMenuOpen(false)}>Developer</Link></li>
          <li><Link to="/reels" className="block text-dark hover:text-darkcyan" onClick={() => setMenuOpen(false)}>Reel</Link></li>
          <li className="text-primary font-semibold">Others</li>
          {othersItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block text-dark hover:text-darkcyan"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a href="tel:+919155105666" className="block text-dark hover:text-darkcyan flex items-center">
              <FontAwesomeIcon icon={faPhoneVolume} className="mr-2" />
              +91 91551-05666
            </a>
          </li>
          <li>
            <button
              className="w-full text-left text-dark font-semibold hover:text-darkcyan"
              onClick={() => setMenuOpen(false)}
            >
              Create a Listing
            </button>
            <ul className="pl-4 space-y-2">
              <li>
                <button
                  className="block w-full text-left text-dark hover:text-darkcyan"
                  onClick={() => {
                    setRoleFormVisible(true);
                    setMenuOpen(false);
                  }}
                >
                  Request Role
                </button>
              </li>
              <li>
                <button
                  className="block w-full text-left text-dark hover:text-darkcyan"
                  onClick={() => {
                    setFranchiseFormVisible(true);
                    setMenuOpen(false);
                  }}
                >
                  Want to be a Franchise
                </button>
              </li>
              <li>
                <button
                  className="block w-full text-left text-dark hover:text-darkcyan"
                  onClick={() => {
                    setMyFranchiseVisible(true);
                    setMenuOpen(false);
                  }}
                >
                  My Franchise
                </button>
              </li>
            </ul>
          </li>
          {isLoggedIn && currentLocation && (
            <li className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-dark" />
              <span className="text-sm text-dark">{getTrimmedLocation(currentLocation)}</span>
            </li>
          )}
        </ul>
      </div>
      {menuOpen && <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}></div>}
      {isLanding && <hr className="border-white" />}

      <RoleForm
        isVisible={roleFormVisible}
        onClose={() => setRoleFormVisible(false)}
      />
      <FranchiseForm
        isVisible={franchiseFormVisible}
        onClose={() => setFranchiseFormVisible(false)}
      />
      <MyFranchiseModal
        isVisible={myFranchiseVisible}
        onClose={() => setMyFranchiseVisible(false)}
      />
    </header>
  );
};

export default MobileHeader;