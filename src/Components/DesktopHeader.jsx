import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLocationDot, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import RoleForm from './RoleForm.jsx';
import FranchiseForm from './FranchiseForm.jsx';
import MyFranchiseModal from './MyFranchiseModal.jsx';
import { getToken, getCurrentLocation, getTrimmedLocation, fetchDistricts } from './utils.js';
import logo from '../assets/logo.png';

const DesktopHeader = ({ path, isLanding }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleFormVisible, setRoleFormVisible] = useState(false);
  const [franchiseFormVisible, setFranchiseFormVisible] = useState(false);
  const [myFranchiseVisible, setMyFranchiseVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [activeMain, setActiveMain] = useState('');
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
        <Link to="/" className="flex items-center no-underline">
          <img src={logo} alt="Logo" className="w-32" />
          <span className={`text-3xl font-bold ${isLanding ? 'text-white' : 'text-darkcyan'}`}>
            Nearprop
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-dark font-bold hover:text-darkcyan" onClick={() => setActiveMain('')}>
                Home
              </Link>
            </li>
            <li className="relative group">
              <span className="text-dark font-bold cursor-pointer hover:text-darkcyan">
                {propertyItems.find(item => location.pathname === item.path)?.label || 'Property'}
              </span>
              <ul className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2">
                {propertyItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="block text-dark px-4 py-2 hover:bg-gray-100"
                      onClick={() => setActiveMain('property')}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link to="/agent" className="text-dark font-bold hover:text-darkcyan">
                Advisor
              </Link>
            </li>
            <li>
              <Link to="/developer" className="text-dark font-bold hover:text-darkcyan">
                Developer
              </Link>
            </li>
            <li>
              <Link to="/reels" className="text-dark font-bold hover:text-darkcyan">
                Reel
              </Link>
            </li>
            <li className="relative group">
              <span className="text-dark font-bold cursor-pointer hover:text-darkcyan">
                {othersItems.find(item => location.pathname === item.path)?.label || 'Others'}
              </span>
              <ul className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2">
                {othersItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="block text-dark px-4 py-2 hover:bg-gray-100"
                      onClick={() => setActiveMain('others')}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <a href="tel:+919155105666" className="text-dark font-bold flex items-center hover:text-darkcyan">
                <FontAwesomeIcon icon={faPhoneVolume} className="mr-2" />
                +91 91551-05666
              </a>
            </li>
            <li className="relative group">
              <button
                className={`border ${isLanding ? 'border-white text-white' : 'border-darkcyan text-darkcyan'} rounded-lg px-4 py-2 font-semibold hover:bg-darkcyan hover:text-white transition`}
              >
                Create a Listing
              </button>
              <ul className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2">
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-dark hover:bg-gray-100"
                    onClick={() => setRoleFormVisible(true)}
                  >
                    Request Role
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-dark hover:bg-gray-100"
                    onClick={() => setFranchiseFormVisible(true)}
                  >
                    Want to be a Franchise
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-dark hover:bg-gray-100"
                    onClick={() => setMyFranchiseVisible(true)}
                  >
                    My Franchise
                  </button>
                </li>
              </ul>
            </li>
          </ul>
          <div className="flex items-center space-x-2">
            <Link to={isLoggedIn ? '/userprofile' : '/login'}>
              <FontAwesomeIcon
                icon={faCircleUser}
                size="2xl"
                className={`cursor-pointer ${isLanding ? 'text-white' : 'text-dark'}`}
              />
            </Link>
            {isLoggedIn && currentLocation && (
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faLocationDot} className={`${isLanding ? 'text-white' : 'text-dark'}`} />
                <span className={`text-sm font-medium ${isLanding ? 'text-white' : 'text-dark'}`}>
                  {getTrimmedLocation(currentLocation)}
                </span>
              </div>
            )}
          </div>
        </nav>
      </div>
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

export default DesktopHeader;