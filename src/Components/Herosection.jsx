import React from 'react';
import CitySelect from './CitySelect';

const HeroSection = ({ activeTab, setActiveTab, formData, handleFormChange, handleSearch }) => {
  return (
    <div className="hero bg-gradient-to-r from-blue-500 to-purple-600 min-h-[60vh] flex items-center justify-center py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-center text-center max-w-5xl">
        <div className="welcome mb-6 md:mb-8">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4 md:mb-6">
            Welcome To Nearprop
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Nearprop is your smart real estate companion — discover, list, and connect with the right properties near you. From dream homes to investment-ready spaces, NearProp makes buying, selling, and renting seamless, fast, and location-focused.
          </p>
        </div>
        <div className="search-box w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="tabs flex flex-wrap justify-center gap-2 mb-4">
            {['all', 'rent', 'sale', 'Restaurants', 'Pg`s'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
                  activeTab === tab ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? 'All Status' : tab === 'Pg`s' ? 'PG & Hostels' : tab === 'Restaurants' ? 'Hotels & Banquet' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <form className="search-form grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" onSubmit={handleSearch}>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-semibold mb-1">Looking For</label>
              <select
                name="propertyType"
                className="border border-gray-300 rounded-md p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.propertyType}
                onChange={handleFormChange}
              >
                <option value="">Select Property</option>
                {['APARTMENT', 'VILLA', 'OFFICE', 'HOTEL', 'MULTI_FAMILY_HOME', 'SINGLE_FAMILY_HOME', 'STUDIO', 'SHOP', 'PG', 'HOSTEL'].map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <CitySelect formData={formData} handleFormChange={handleFormChange} />
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-semibold mb-1">Property Size</label>
              <select
                name="bedrooms"
                className="border border-gray-300 rounded-md p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.bedrooms}
                onChange={handleFormChange}
                >
                <option value="">Bedrooms</option>
                {['1', '2', '3', '4'].map((bed) => (
                  <option key={bed} value={bed}>
                    {bed === '4' ? '4+ BHK' : `${bed} BHK`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-semibold mb-1">Price Range</label>
              <select
                name="priceRange"
                className="border border-gray-300 rounded-md p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.priceRange}
                onChange={handleFormChange}
              >
                <option value="">Min. Price</option>
                {['Rs 10K-20K', 'Rs 30K-40K', 'Rs 50K-100K'].map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn-search bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-md transition-colors col-span-1 sm:col-span-2 lg:col-span-1 mt-4 lg:mt-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;